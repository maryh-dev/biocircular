import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase.js';

const obterSolicitacoesRef = () => collection(db, 'solicitacoes');

export function observarSolicitacoesRota(callback, onError) {
  const pendentes = query(obterSolicitacoesRef(), where('status', '==', 'solicitada'));
  return onSnapshot(pendentes, (snapshot) => {
    callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
  }, onError);
}

export function observarColetores(callback, onError) {
  const coletores = query(
    collection(db, 'users'),
    where('role', '==', 'coletor'),
    where('ativo', '==', true)
  );
  return onSnapshot(coletores, (snapshot) => {
    callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
  }, onError);
}

export function observarRotaColetor(uid, callback, onError) {
  const rota = query(obterSolicitacoesRef(), where('coletorUid', '==', uid));
  return onSnapshot(rota, (snapshot) => {
    callback(snapshot.docs
      .map((item) => ({ id: item.id, ...item.data() }))
      .filter((item) => ['agendada', 'em_rota'].includes(item.status))
      .sort((a, b) => (a.ordemRota ?? Number.MAX_SAFE_INTEGER) - (b.ordemRota ?? Number.MAX_SAFE_INTEGER)));
  }, onError);
}

export function otimizarSequencia(paradas) {
  if (paradas.length < 2) {
    return {
      paradas,
      geometria: paradas.map((parada) => [parada.latitude, parada.longitude]),
      distanciaMetros: 0,
    };
  }

  const distanciaEntre = (a, b) => {
    const radianos = (graus) => (graus * Math.PI) / 180;
    const latitudeA = radianos(a.latitude);
    const latitudeB = radianos(b.latitude);
    const variacaoLatitude = latitudeB - latitudeA;
    const variacaoLongitude = radianos(b.longitude - a.longitude);
    const haversine = Math.min(1, Math.sin(variacaoLatitude / 2) ** 2
      + Math.cos(latitudeA) * Math.cos(latitudeB)
      * Math.sin(variacaoLongitude / 2) ** 2);

    return 6371000 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  };
  const restantes = [...paradas];
  const ordenadas = [restantes.shift()];

  while (restantes.length) {
    const atual = ordenadas[ordenadas.length - 1];
    let maisProxima = 0;

    for (let index = 1; index < restantes.length; index += 1) {
      if (distanciaEntre(atual, restantes[index]) < distanciaEntre(atual, restantes[maisProxima])) {
        maisProxima = index;
      }
    }
    ordenadas.push(restantes.splice(maisProxima, 1)[0]);
  }

  const distanciaMetros = ordenadas.slice(1).reduce(
    (total, parada, index) => total + distanciaEntre(ordenadas[index], parada),
    0
  );

  return {
    paradas: ordenadas,
    geometria: ordenadas.map((parada) => [parada.latitude, parada.longitude]),
    distanciaMetros,
  };
}

export async function publicarRota(paradas, coletorUid, operadorUid) {
  if (paradas.length > 500) {
    throw new Error('Uma rota pode conter no máximo 500 paradas.');
  }
  const batch = writeBatch(db);
  const rotaId = crypto.randomUUID();
  paradas.forEach((parada, index) => {
    batch.update(doc(db, 'solicitacoes', parada.id), {
      status: 'agendada',
      rotaId,
      coletorUid,
      operadorUid,
      ordemRota: index + 1,
      rotaPublicadaEm: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });

  await batch.commit();
  return rotaId;
}

export async function registrarColeta(solicitacao, codigoLido, volumeLitros, coletor, nomeColetor) {
  const codigoSolicitado = String(solicitacao.recipienteCodigo || '').trim().toUpperCase();
  const codigoInformado = String(codigoLido || '').trim().toUpperCase();
  const volume = Number(volumeLitros);

  if (!codigoSolicitado || codigoInformado !== codigoSolicitado) {
    throw new Error('O QR Code não corresponde ao recipiente desta parada.');
  }
  if (!Number.isFinite(volume) || volume <= 0) {
    throw new Error('Informe um volume coletado maior que zero.');
  }

  await updateDoc(doc(db, 'solicitacoes', solicitacao.id), {
    status: 'coletada',
    recipienteCodigoLido: codigoInformado,
    volumeColetadoLitros: volume,
    coletadoPorUid: coletor.uid,
    coletadoPorNome: nomeColetor || coletor.displayName || coletor.email || 'Coletor',
    coletadaEm: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}
