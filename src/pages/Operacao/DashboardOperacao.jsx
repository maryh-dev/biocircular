import React from 'react';
import { ArrowRight, ClipboardList, Package, Route, Truck } from 'lucide-react';
import { useNavigate } from '../../components/NavigationContext';

const statusCards = [
  ['8', 'Solicitações pendentes', 'op-solicitacoes', ClipboardList],
  ['4', 'Rotas de hoje', 'op-rota', Route],
  ['6', 'Lotes em transporte', 'op-lotes', Truck],
  ['3', 'Recebimentos pendentes', 'op-recebimento', Package],
];

export default function DashboardOperacao() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bioclube-light font-sans text-bioclube-textMain">
        <header className="border-b border-bioclube-border bg-white px-4 py-4 sm:px-8">
          <div className="flex items-center justify-between">
            <p className="text-xs text-bioclube-textSub">BIOCIRCULAR <span aria-hidden="true">/</span> <strong className="text-bioclube-textMain">Dashboard da operação</strong></p>
            <span className="hidden text-xs text-bioclube-textSub sm:inline">Marina Oliveira · Operação</span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-bioclube-amber">Centro de controle</p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Dashboard da operação</h1>
          <p className="mt-1 text-sm text-bioclube-textSub">
            Analise solicitações, organize rotas e acompanhe cada lote até o destino final.
          </p>
        </div>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Resumo operacional">
          {statusCards.map(([value, label, screen, Icon]) => (
            <button
              key={label}
              type="button"
              onClick={() => navigate(screen)}
              className="rounded-xl border border-bioclube-border bg-white p-5 text-left shadow-sm transition hover:border-bioclube-amber focus:outline-none focus-visible:ring-2 focus-visible:ring-bioclube-amber"
            >
              <Icon className="h-5 w-5 text-bioclube-amber" aria-hidden="true" />
              <strong className="mt-4 block text-2xl">{value}</strong>
              <span className="mt-1 block text-xs text-bioclube-textSub">{label}</span>
            </button>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <article className="rounded-xl border border-bioclube-border bg-white p-5 shadow-sm lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-bold">Fluxo em andamento</h2>
                <p className="mt-1 text-xs text-bioclube-textSub">A operação conduz a solicitação até a coleta.</p>
              </div>
              <button type="button" onClick={() => navigate('op-solicitacoes')} className="flex items-center gap-1 text-xs font-bold text-bioclube-dark">
                Ver solicitações <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              {['Solicitada', 'Agendada', 'Em rota', 'Em coleta'].map((step, index) => (
                <div key={step} className="rounded-lg bg-bioclube-light p-3">
                  <span className="text-[10px] font-bold text-bioclube-amber">0{index + 1}</span>
                  <p className="mt-2 text-xs font-semibold">{step}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-xl border border-bioclube-border bg-white p-5 shadow-sm">
            <h2 className="font-bold">Próxima decisão</h2>
            <p className="mt-2 text-sm font-semibold">SOL-2026-00984</p>
            <p className="mt-1 text-xs leading-relaxed text-bioclube-textSub">
              Solicitação do Bistrô da Serra aguardando organização da rota.
            </p>
            <button type="button" onClick={() => navigate('op-detalhes')} className="mt-5 w-full rounded-lg bg-bioclube-dark px-4 py-3 text-xs font-bold text-white">
              Abrir solicitação
            </button>
          </article>
        </section>
      </main>
    </div>
  );
}
