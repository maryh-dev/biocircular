// Camada de dados do BIOCIRCULAR: tudo que fala com o Firestore fica aqui.
import {
  addDoc, collection, doc, getDoc, onSnapshot, query, runTransaction, serverTimestamp, setDoc, updateDoc, where,
} from 'firebase/firestore';
import { db } from './firebase.js';

export const STATUS_SOLICITACAO = {
  solicitada: 'Solicitada',
  agendada: 'Agendada',
  em_rota: 'Em rota',
  coletada: 'Coletada',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
};

export const TRANSICOES_SOLICITACAO = {
  solicitada: ['solicitada', 'agendada', 'cancelada'],
  agendada: ['agendada', 'em_rota', 'cancelada'],
  em_rota: ['em_rota', 'coletada', 'cancelada'],
  coletada: ['coletada', 'concluida'],
  concluida: ['concluida'],
  cancelada: ['cancelada'],
};

// ---------- Perfil ----------
let nomePendente = null; // nome digitado no cadastro, usado quando o perfil é criado
let telefonePendente = null; // telefone digitado no cadastro, usado quando o perfil é criado
export function definirNomePendente(nome) { nomePendente = nome || null; }
export function definirTelefonePendente(telefone) { telefonePendente = telefone ? telefone.trim() : null; }

// Lê users/{uid}; novos cadastros criam o próprio perfil inicial como gerador.
export async function carregarOuCriarPerfil(user) {
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const perfil = snap.data();
    if (perfil.ativo !== true) {
      const error = new Error('O acesso desta conta ao aplicativo foi removido. Fale com um administrador.');
      error.code = 'account-disabled';
      throw error;
    }
    return perfil;
  }

  const perfil = {
    nome: nomePendente || user.displayName || (user.email || '').split('@')[0],
    email: user.email || '',
    telefone: telefonePendente || '',
    role: 'gerador',
    ativo: false,
    createdAt: serverTimestamp(),
  };
  await setDoc(ref, perfil);
  nomePendente = null;
  telefonePendente = null;
  return {
    ...perfil,
    createdAt: null,
  };
}

// ---------- Solicitações ----------
function ordenarPorData(lista) {
  return [...lista].sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
}

function assinar(q, callback, onError) {
  return onSnapshot(
    q,
    (snap) => callback(ordenarPorData(snap.docs.map((d) => ({ id: d.id, ...d.data() })))),
    (error) => { console.error(error); onError?.(error); },
  );
}

export async function registrarMovimentacao(dados) {
  await addDoc(collection(db, 'movimentacoes'), { ...dados, createdAt: serverTimestamp() });
}

export async function criarSolicitacao(user, perfil, dados) {
  const ref = await addDoc(collection(db, 'solicitacoes'), {
    solicitanteUid: user.uid,
    solicitanteNome: perfil.nome || user.email,
    dataPreferencial: dados.dataPreferencial,
    janela: dados.janela,
    endereco: dados.endereco,
    recipienteCodigo: dados.recipienteCodigo,
    latitude: Number(dados.latitude),
    longitude: Number(dados.longitude),
    volumeLitros: Number(dados.volumeLitros) || 0,
    observacoes: dados.observacoes || '',
    status: 'solicitada',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  // O histórico é opcional: se falhar, a solicitação já foi criada.
  registrarMovimentacao({
    solicitacaoId: ref.id, tipo: 'solicitacao_criada', statusNovo: 'solicitada', responsavelUid: user.uid,
  }).catch(() => {});
  return ref.id;
}

// Gerador: só as suas (a regra exige o filtro por solicitanteUid).
export function observarMinhasSolicitacoes(uid, callback, onError) {
  return assinar(query(collection(db, 'solicitacoes'), where('solicitanteUid', '==', uid)), callback, onError);
}

// Operação (operador): todas.
export function observarTodasSolicitacoes(callback, onError) {
  return assinar(collection(db, 'solicitacoes'), callback, onError);
}

export async function mudarStatusSolicitacao(user, solicitacao, novoStatus) {
  if (!TRANSICOES_SOLICITACAO[solicitacao.status]?.includes(novoStatus)) {
    throw new Error(`Não é permitido mudar uma solicitação de "${solicitacao.status}" para "${novoStatus}".`);
  }
  await updateDoc(doc(db, 'solicitacoes', solicitacao.id), { status: novoStatus, updatedAt: serverTimestamp() });
  registrarMovimentacao({
    solicitacaoId: solicitacao.id, tipo: 'status_alterado',
    statusAnterior: solicitacao.status, statusNovo: novoStatus, responsavelUid: user.uid,
  }).catch(() => {});
}

// ---------- Lotes / recebimentos / destinações ----------
export async function criarLote(user, solicitacoes) {
  if (!solicitacoes.length) throw new Error('Selecione ao menos uma coleta concluída.');
  if (solicitacoes.length > 249) throw new Error('Um lote pode reunir no máximo 249 coletas.');

  const ref = doc(collection(db, 'lotes'));
  const refs = solicitacoes.map(({ id }) => doc(db, 'solicitacoes', id));
  const codigo = `LOT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${ref.id.slice(0, 6).toUpperCase()}`;
  await runTransaction(db, async (transaction) => {
    const snapshots = await Promise.all(refs.map((solicitacaoRef) => transaction.get(solicitacaoRef)));
    const dadosColetas = snapshots.map((snapshot) => {
      if (!snapshot.exists() || snapshot.data().status !== 'coletada' || snapshot.data().loteId) {
        throw new Error('Uma das coletas selecionadas já foi incluída em outro lote ou não está mais concluída. Atualize a lista e tente novamente.');
      }
      return snapshot.data();
    });
    const volumeLitros = dadosColetas.reduce(
      (total, solicitacao) => total + (Number(solicitacao.volumeColetadoLitros) || 0),
      0
    );
    const rotaIds = new Set(dadosColetas.map((solicitacao) => solicitacao.rotaId).filter(Boolean));
    transaction.set(ref, {
      codigo,
      rota: rotaIds.size === 1 ? [...rotaIds][0] : '',
      volumeLitros,
      solicitacaoIds: solicitacoes.map(({ id }) => id),
      quantidadeColetas: solicitacoes.length,
      status: 'em_transporte',
      responsavelUid: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    refs.forEach((solicitacaoRef) => {
      transaction.update(solicitacaoRef, { loteId: ref.id, updatedAt: serverTimestamp() });
    });
  });
  registrarMovimentacao({ loteId: ref.id, tipo: 'lote_criado', statusNovo: 'em_transporte', responsavelUid: user.uid }).catch(() => {});
  return { id: ref.id, codigo };
}

export function observarLotes(callback, onError) {
  return assinar(collection(db, 'lotes'), callback, onError);
}

export async function registrarRecebimento(user, dados) {
  const quantidadeLitros = Number(dados.quantidadeLitros);
  if (!Number.isFinite(quantidadeLitros) || quantidadeLitros <= 0) {
    throw new Error('Informe uma quantidade recebida maior que zero.');
  }

  const loteRef = doc(db, 'lotes', dados.loteId);
  const recebimentoRef = doc(collection(db, 'recebimentos'));
  await runTransaction(db, async (transaction) => {
    const lote = await transaction.get(loteRef);
    if (!lote.exists()) throw new Error('O lote selecionado não existe mais.');
    if (lote.data().status !== 'em_transporte') throw new Error('Este lote não está aguardando recebimento.');

    transaction.set(recebimentoRef, {
      loteId: dados.loteId,
      quantidadeLitros,
      resultado: dados.resultado || 'conforme',
      observacoes: dados.observacoes || '',
      responsavelUid: user.uid,
      createdAt: serverTimestamp(),
    });
    transaction.update(loteRef, {
      status: 'recebido',
      quantidadeRecebidaLitros: quantidadeLitros,
      recebidoEm: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
  registrarMovimentacao({
    loteId: dados.loteId, tipo: 'recebimento_registrado', statusAnterior: 'em_transporte', statusNovo: 'recebido', responsavelUid: user.uid,
  }).catch(() => {});
  return recebimentoRef.id;
}

export async function registrarDestinacao(user, dados) {
  const quantidadeLitros = Number(dados.quantidadeLitros);
  if (!dados.destinatario?.trim() || !dados.tipoDestino?.trim()) {
    throw new Error('Informe a unidade de destino e o tipo de destinação.');
  }
  if (!Number.isFinite(quantidadeLitros) || quantidadeLitros <= 0) {
    throw new Error('Informe uma quantidade destinada maior que zero.');
  }

  const loteRef = doc(db, 'lotes', dados.loteId);
  const destinacaoRef = doc(collection(db, 'destinacoes'));
  await runTransaction(db, async (transaction) => {
    const lote = await transaction.get(loteRef);
    if (!lote.exists()) throw new Error('O lote selecionado não existe mais.');
    if (lote.data().status !== 'recebido') throw new Error('O lote precisa ser recebido antes da destinação.');
    const quantidadeRecebida = Number(lote.data().quantidadeRecebidaLitros) || 0;
    if (quantidadeLitros > quantidadeRecebida) {
      throw new Error('A quantidade destinada não pode exceder o volume recebido.');
    }

    transaction.set(destinacaoRef, {
      loteId: dados.loteId,
      destinatario: dados.destinatario.trim(),
      tipoDestino: dados.tipoDestino.trim(),
      quantidadeLitros,
      observacoes: dados.observacoes || '',
      responsavelUid: user.uid,
      destinadoEm: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
    transaction.update(loteRef, {
      status: 'destinado',
      quantidadeDestinadaLitros: quantidadeLitros,
      destinadoEm: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
  registrarMovimentacao({
    loteId: dados.loteId, tipo: 'destinacao_registrada', statusNovo: 'destinado', responsavelUid: user.uid,
  }).catch(() => {});
  return destinacaoRef.id;
}
