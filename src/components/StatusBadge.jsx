import React from 'react';
import { STATUS_SOLICITACAO } from '../services/db.js';

const CORES = {
  solicitada: 'bg-gray-100 text-gray-800',
  agendada: 'bg-amber-100 text-amber-800',
  em_rota: 'bg-blue-100 text-blue-800',
  coletada: 'bg-indigo-100 text-indigo-800',
  concluida: 'bg-green-100 text-green-800',
  cancelada: 'bg-red-100 text-red-800',
};

export default function StatusBadge({ status }) {
  return <span className={`${CORES[status] || 'bg-gray-100 text-gray-800'} px-2.5 py-1 rounded-full font-bold`}>{STATUS_SOLICITACAO[status] || status}</span>;
}

export function formatarData(iso) {
  if (!iso) return '—';
  const [a, m, d] = iso.split('-');
  return a && m && d ? `${d}/${m}/${a}` : iso;
}
