import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from './firebase.js';

export const FUNCOES_USUARIO = [
  { valor: 'gerador', rotulo: 'Gerador' },
  { valor: 'operador', rotulo: 'Operador' },
  { valor: 'coletor', rotulo: 'Coletor' },
  { valor: 'destino', rotulo: 'Destino final' },
  { valor: 'admin', rotulo: 'Administrador' },
];

export function observarUsuarios(callback, onError) {
  return onSnapshot(
    collection(db, 'users'),
    (snapshot) => callback(
      snapshot.docs
        .map((userDoc) => ({ id: userDoc.id, ...userDoc.data() }))
        .sort((a, b) => (a.nome || a.email || '').localeCompare(b.nome || b.email || '', 'pt-BR'))
    ),
    onError
  );
}

export function alterarFuncaoUsuario(uid, role) {
  if (!FUNCOES_USUARIO.some((funcao) => funcao.valor === role)) {
    throw new Error('A função selecionada não é válida.');
  }
  return updateDoc(doc(db, 'users', uid), { role });
}

export function alterarStatusUsuario(uid, ativo) {
  if (typeof ativo !== 'boolean') {
    throw new Error('O status selecionado não é válido.');
  }
  return updateDoc(doc(db, 'users', uid), { ativo });
}
