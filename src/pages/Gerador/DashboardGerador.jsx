import React from 'react';
import { useNavigate } from '../../components/NavigationContext';

export default function DashboardGerador() {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-full bg-bioclube-light font-sans">
      <main className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">

        <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-bioclube-textMain">Olá, Bistrô da Serra</h1>
            <p className="mt-1 text-sm sm:text-base text-bioclube-textSub">Acompanhe os seus recipientes e histórico de recolha.</p>
          </div>
          <button onClick={() => navigate('gerador-solicitar')} className="w-full sm:w-auto rounded-lg bg-bioclube-dark px-5 py-3 sm:py-2.5 text-sm font-medium text-white hover:bg-bioclube-secondary transition-colors">
            + Solicitar recolha
          </button>
        </header>

        {/* Métricas */}
        <section className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-bioclube-border bg-white p-4 sm:p-5 shadow-sm">
            <div className="mb-3 sm:mb-4 flex items-center justify-between text-bioclube-amber">
              <span className="rounded bg-amber-50 p-2 text-lg sm:text-xl" aria-hidden="true">💧</span>
              <span className="text-xs font-semibold text-green-600">+18%</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-bioclube-textMain">2.840 L</h3>
            <p className="text-xs sm:text-sm text-bioclube-textSub">Volume destinado (2026)</p>
          </div>

          <div className="rounded-xl border border-bioclube-border bg-white p-4 sm:p-5 shadow-sm">
            <div className="mb-3 sm:mb-4 text-blue-500">
              <span className="rounded bg-blue-50 p-2 text-lg sm:text-xl" aria-hidden="true">✔️</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-bioclube-textMain">18</h3>
            <p className="text-xs sm:text-sm text-bioclube-textSub">Recolhas concluídas</p>
          </div>

          <div className="rounded-xl border border-bioclube-border bg-white p-4 sm:p-5 shadow-sm">
            <div className="mb-3 sm:mb-4 text-indigo-500">
              <span className="rounded bg-indigo-50 p-2 text-lg sm:text-xl" aria-hidden="true">📅</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-bioclube-textMain">27 set</h3>
            <p className="text-xs sm:text-sm text-bioclube-textSub">Próxima recolha</p>
          </div>

          <div className="rounded-xl border border-bioclube-border bg-white p-4 sm:p-5 shadow-sm">
            <div className="mb-3 sm:mb-4 text-bioclube-textSub">
              <span className="rounded bg-bioclube-light p-2 text-lg sm:text-xl" aria-hidden="true">📦</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-bioclube-textMain">2</h3>
            <p className="text-xs sm:text-sm text-bioclube-textSub">Recipientes ativos</p>
          </div>
        </section>

        {/* Módulos do Meio */}
        <section className="mb-6 sm:mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <article className="lg:col-span-2 rounded-xl border border-bioclube-border bg-white p-5 sm:p-6 shadow-sm">
            <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base sm:text-lg font-bold text-bioclube-textMain">Próxima recolha</h2>
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">Agendada</span>
            </div>

            <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-[10px] sm:text-xs font-semibold uppercase text-bioclube-textSub">Solicitação</p>
                <p className="text-sm sm:text-base font-medium text-bioclube-textMain break-all">SOL-2026-00984</p>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-semibold uppercase text-bioclube-textSub">Data</p>
                <p className="text-sm sm:text-base font-medium text-bioclube-textMain">27/09/2026</p>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-semibold uppercase text-bioclube-textSub">Janela</p>
                <p className="text-sm sm:text-base font-medium text-bioclube-textMain">10:00–11:00</p>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-semibold uppercase text-bioclube-textSub">Estimativa</p>
                <p className="text-sm sm:text-base font-medium text-bioclube-textMain">180 L</p>
              </div>
            </div>

            <div className="mb-6 flex items-start gap-2 rounded-lg bg-blue-50 p-3 sm:p-4 text-xs sm:text-sm text-blue-800">
              <span aria-hidden="true" className="mt-0.5">ℹ️</span>
              <span>Deixe o recipiente REC-00482 acessível para identificação por QR Code.</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => navigate('op-detalhes')} className="w-full sm:w-auto rounded-lg border border-bioclube-border px-4 py-2.5 sm:py-2 text-sm font-medium text-bioclube-textMain hover:bg-bioclube-light transition-colors">Ver detalhes</button>
              <button onClick={() => navigate('coletor-inicio')} className="w-full sm:w-auto rounded-lg bg-bioclube-dark px-4 py-2.5 sm:py-2 text-sm font-medium text-white hover:bg-bioclube-secondary transition-colors">Acompanhar recolha</button>
            </div>
          </article>

          <article className="rounded-xl border border-bioclube-border bg-white p-5 sm:p-6 shadow-sm">
            <h2 className="mb-4 sm:mb-6 text-base sm:text-lg font-bold text-bioclube-textMain">Recipientes</h2>
            <div className="mb-4 flex items-center justify-between rounded-lg bg-bioclube-light p-3 sm:p-4">
              <div className="flex items-center gap-3">
                <span className="hidden sm:block rounded bg-amber-100 p-2 text-amber-600" aria-hidden="true">📦</span>
                <div>
                  <p className="text-sm sm:text-base font-bold text-bioclube-textMain">REC-00482</p>
                  <p className="text-[11px] sm:text-xs text-bioclube-textSub">Bombona 200 L · 68% est.</p>
                </div>
              </div>
              <span className="rounded-full bg-green-100 px-2 py-1 text-[10px] sm:text-xs font-semibold text-green-800">Ativo</span>
            </div>
            <button onClick={() => navigate('gerador-recipiente')} className="w-full rounded-lg border border-bioclube-border px-4 py-2.5 sm:py-2 text-sm font-medium text-bioclube-textMain hover:bg-bioclube-light transition-colors">
              <span className="mr-2" aria-hidden="true">🔗</span> Ver QR Code
            </button>
          </article>
        </section>

        {/* Tabela */}
        <section className="rounded-xl border border-bioclube-border bg-white shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-bioclube-border p-4 sm:p-6 gap-4">
            <h2 className="text-base sm:text-lg font-bold text-bioclube-textMain">Histórico recente</h2>
            <div className="flex gap-2">
              <button className="flex-1 sm:flex-none rounded-lg border border-bioclube-border px-3 py-2 sm:py-1.5 text-sm font-medium text-bioclube-textMain hover:bg-bioclube-light">Filtros</button>
              <button className="flex-1 sm:flex-none rounded-lg border border-bioclube-border px-3 py-2 sm:py-1.5 text-sm font-medium text-bioclube-textMain hover:bg-bioclube-light">Exportar</button>
            </div>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[800px] text-left text-sm text-bioclube-textSub">
              <thead className="bg-bioclube-light text-xs font-semibold uppercase text-bioclube-textSub border-b border-bioclube-border">
                <tr>
                  <th className="px-4 sm:px-6 py-3 sm:py-4">ID</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4">Origem</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4">Quantidade</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4">Data</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4">Estado</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bioclube-border">
                <tr className="hover:bg-bioclube-light transition-colors">
                  <td className="px-4 sm:px-6 py-4 font-medium text-bioclube-textMain">SOL-2026-00984</td>
                  <td className="px-4 sm:px-6 py-4">Bistrô da Serra</td>
                  <td className="px-4 sm:px-6 py-4">180 L</td>
                  <td className="px-4 sm:px-6 py-4">27/09 · 10:00</td>
                  <td className="px-4 sm:px-6 py-4"><span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800 whitespace-nowrap">Agendada</span></td>
                  <td className="px-4 sm:px-6 py-4 text-right"><button className="p-2 -mr-2 text-bioclube-textSub hover:text-bioclube-textMain">⬢⬢⬢</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
