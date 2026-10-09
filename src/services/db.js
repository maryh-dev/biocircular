// Camada de dados do BIOCIRCULAR: tudo que fala com o Firestore fica aqui.
import {
  addDoc, collection, doc, getDoc, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where,
} from 'firebase/firestore';
import { db } from './firebase.js';

export const ROLES = ['admin', 'operador', 'gerador', 'coletor', 'destino'];

export const STATUS_SOLICITACAO = {
  solicitada: 'Solicitada',
  agendada: 'Agendada',
  em_rota: 'Em rota',
  coletada: 'Coletada',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
};

// ---------- Perfil ----------
let nomePendente = null; // nome digitado no cadastro, usado quando o perfil é criado
export function definirNomePendente(nome) { nomePendente = nome || null; }

// Lê users/{uid}; se ainda não existir, cria como "gerador" (única função que a regra permite).
export async function carregarOuCriarPerfil(user) {
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data();
  const perfil = {
    nome: nomePendente || user.displayName || (user.email || '').split('@')[0],
    email: user.email || '',
    role: 'gerador',
    ativo: true,
    createdAt: serverTimestamp(),
  };
  await setDoc(ref, perfil);
  nomePendente = null;
  return { ...perfil, createdAt: null };
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

// Operação (admin/operador): todas.
export function observarTodasSolicitacoes(callback, onError) {
  return assinar(collection(db, 'solicitacoes'), callback, onError);
}

export async function mudarStatusSolicitacao(user, solicitacao, novoStatus) {
  await updateDoc(doc(db, 'solicitacoes', solicitacao.id), { status: novoStatus, updatedAt: serverTimestamp() });
  registrarMovimentacao({
    solicitacaoId: solicitacao.id, tipo: 'status_alterado',
    statusAnterior: solicitacao.status, statusNovo: novoStatus, responsavelUid: user.uid,
  }).catch(() => {});
}

// ---------- Lotes / recebimentos / destinações ----------
export async function criarLote(user, dados) {
  const ref = await addDoc(collection(db, 'lotes'), {
    codigo: dados.codigo, rota: dados.rota || '', volumeLitros: Number(dados.volumeLitros) || 0,
    status: 'em_transporte', responsavelUid: user.uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  });
  registrarMovimentacao({ loteId: ref.id, tipo: 'lote_criado', statusNovo: 'em_transporte', responsavelUid: user.uid }).catch(() => {});
  return ref.id;
}

export function observarLotes(callback, onError) {
  return assinar(collection(db, 'lotes'), callback, onError);
}

export async function registrarRecebimento(user, dados) {
  const ref = await addDoc(collection(db, 'recebimentos'), {
    loteId: dados.loteId, quantidadeLitros: Number(dados.quantidadeLitros) || 0,
    resultado: dados.resultado || 'conforme', observacoes: dados.observacoes || '',
    responsavelUid: user.uid, createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, 'lotes', dados.loteId), { status: 'recebido', updatedAt: serverTimestamp() });
  registrarMovimentacao({
    loteId: dados.loteId, tipo: 'recebimento_registrado', statusAnterior: 'em_transporte', statusNovo: 'recebido', responsavelUid: user.uid,
  }).catch(() => {});
  return ref.id;
}

export async function registrarDestinacao(user, dados) {
  const ref = await addDoc(collection(db, 'destinacoes'), {
    loteId: dados.loteId, destinatario: dados.destinatario || '', tipoDestino: dados.tipoDestino || '',
    quantidadeLitros: Number(dados.quantidadeLitros) || 0, observacoes: dados.observacoes || '',
    responsavelUid: user.uid, destinadoEm: serverTimestamp(), createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, 'lotes', dados.loteId), { status: 'destinado', updatedAt: serverTimestamp() }).catch(() => {});
  registrarMovimentacao({
    loteId: dados.loteId, tipo: 'destinacao_registrada', statusNovo: 'destinado', responsavelUid: user.uid,
  }).catch(() => {});
  return ref.id;
}
