import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, CheckCircle2, Droplet, FileText, Package, Plus } from 'lucide-react';
import { observarMinhasSolicitacoes, STATUS_SOLICITACAO } from '../../services/db.js';

function exibirData(valor) {
  if (!valor) return 'Data não definida';
  const data = new Date(`${valor}T00:00:00`);
  return Number.isNaN(data.getTime())
    ? 'Data não definida'
    : new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(data);
}

export default function DashboardGerador({ session, onNavigate }) {
  const [solicitacoes, setSolicitacoes] = useState(null);
  const [erro, setErro] = useState('');
  const nome = session?.profile?.nome || session?.user?.email || 'Gerador';
  const ativas = useMemo(
    () => (solicitacoes || []).filter((item) => !['concluida', 'cancelada'].includes(item.status)),
    [solicitacoes]
  );
  const concluidas = useMemo(
    () => (solicitacoes || []).filter((item) => ['coletada', 'concluida'].includes(item.status)),
    [solicitacoes]
  );
  const volumeColetado = concluidas.reduce((total, item) => total + (Number(item.volumeColetadoLitros) || 0), 0);
  const proxima = ativas
    .filter((item) => item.dataPreferencial)
    .sort((a, b) => a.dataPreferencial.localeCompare(b.dataPreferencial))[0];

  useEffect(() => observarMinhasSolicitacoes(
    session.user.uid,
    setSolicitacoes,
    (error) => {
      console.error('Não foi possível carregar os indicadores do gerador:', error);
      setErro('Não foi possível carregar seus dados. Confira as regras do Firestore.');
    }
  ), [session.user.uid]);

  const indicadores = [
    { icone: Droplet, valor: `${volumeColetado.toLocaleString('pt-BR')} L`, rotulo: 'Volume coletado' },
    { icone: FileText, valor: solicitacoes === null ? '…' : concluidas.length, rotulo: 'Coletas concluídas' },
    { icone: Calendar, valor: exibirData(proxima?.dataPreferencial), rotulo: 'Próxima coleta' },
    { icone: Package, valor: ativas.length, rotulo: 'Solicitações ativas' },
  ];

  return (
    <main className="min-h-screen bg-bioclube-light px-4 py-6 text-bioclube-textMain sm:px-6 sm:py-9 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-7">
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Área do gerador</p>
            <h1 className="mt-2 text-2xl font-extrabold text-bioclube-dark">Olá, {nome.split(/\s+/)[0]}</h1>
            <p className="mt-2 text-sm text-bioclube-textSub">Acompanhe as solicitações e o volume realmente coletado.</p>
          </div>
          <button type="button" onClick={() => onNavigate?.('gerador-solicitar')} className="inline-flex items-center justify-center gap-2 rounded-lg bg-bioclube-dark px-4 py-3 text-sm font-bold text-white hover:bg-bioclube-secondary">
            <Plus className="h-4 w-4" /> Solicitar coleta
          </button>
        </section>
        {erro && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{erro}</p>}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {indicadores.map(({ icone: Icon, valor, rotulo }) => (
            <article key={rotulo} className="rounded-2xl border border-bioclube-border bg-white p-5 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><Icon className="h-5 w-5" /></span>
              <p className="mt-5 text-2xl font-extrabold">{valor}</p>
              <p className="mt-1 text-xs text-bioclube-textSub">{rotulo}</p>
            </article>
          ))}
        </section>
        <section className="rounded-2xl border border-bioclube-border bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-bold">Solicitações recentes</h2>
              <p className="mt-1 text-xs text-bioclube-textSub">O status é atualizado pela operação e pelo coletor.</p>
            </div>
            <button type="button" onClick={() => onNavigate?.('gerador-minhas')} className="text-sm font-bold text-amber-800 underline">Ver todas</button>
          </div>
          {solicitacoes === null ? <p className="py-8 text-center text-sm text-bioclube-textSub">Carregando solicitações…</p>
            : solicitacoes.length === 0 ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-bioclube-textSub" />
                <p className="mt-3 text-sm text-bioclube-textSub">Você ainda não tem solicitações.</p>
                <button type="button" onClick={() => onNavigate?.('gerador-solicitar')} className="mt-3 text-sm font-bold text-amber-800 underline">Criar primeira solicitação</button>
              </div>
            ) : (
              <ul className="mt-4 divide-y divide-bioclube-border">
                {solicitacoes.slice(0, 5).map((item) => (
                  <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                    <div className="min-w-0">
                      <strong className="block truncate text-sm">{item.endereco}</strong>
                      <span className="mt-1 block text-xs text-bioclube-textSub">{exibirData(item.dataPreferencial)} · {item.janela || 'Horário não definido'} · {item.recipienteCodigo || 'Sem recipiente'}</span>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">{STATUS_SOLICITACAO[item.status] || item.status}</span>
                  </li>
                ))}
              </ul>
            )}
        </section>
      </div>
    </main>
  );
}
