import React from 'react';
import { useNavigate } from '../../components/NavigationContext';

export default function MinhasSolicitacoes() {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-full bg-bioclube-light font-sans">
      <main className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">

        <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-bioclube-textMain">As minhas solicitações</h1>
            <p className="mt-1 text-sm sm:text-base text-bioclube-textSub">Consulte o estado das suas recolhas.</p>
          </div>
          <button onClick={() => navigate('gerador-solicitar')} className="w-full sm:w-auto rounded-lg bg-bioclube-dark px-5 py-3 sm:py-2.5 text-sm font-medium text-white hover:bg-bioclube-secondary transition-colors">
            + Nova solicitação
          </button>
        </header>

        <div className="mb-6 flex flex-col md:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1 w-full">
            <span className="absolute left-3 sm:left-4 top-3 sm:top-2.5 text-bioclube-textSub" aria-hidden="true">🔍</span>
            <input
              type="text"
              placeholder="Pesquisar ID..."
              className="w-full rounded-lg border border-bioclube-border py-3 sm:py-2.5 pl-10 sm:pl-12 pr-4 text-sm sm:text-base focus:border-bioclube-amber focus:outline-none focus:ring-1 focus:ring-bioclube-amber"
            />
          </div>
          <div className="flex gap-3 sm:gap-4 flex-col sm:flex-row w-full md:w-auto">
            <select className="w-full sm:w-48 md:w-56 rounded-lg border border-bioclube-border px-3 sm:px-4 py-3 sm:py-2.5 text-sm sm:text-base focus:border-bioclube-amber focus:outline-none bg-white">
              <option>Todos os estados</option>
            </select>
            <div className="relative w-full sm:w-48 md:w-56">
               <input type="text" readOnly defaultValue="Últimos 30 dias" className="w-full rounded-lg border border-bioclube-border px-3 sm:px-4 py-3 sm:py-2.5 pr-10 text-sm sm:text-base cursor-default bg-white" />
               <span className="absolute right-3 sm:right-4 top-3 sm:top-2.5 text-bioclube-textSub" aria-hidden="true">📅</span>
            </div>
          </div>
        </div>

        <nav className="mb-6 flex gap-6 sm:gap-8 border-b border-bioclube-border text-xs sm:text-sm font-medium text-bioclube-textSub overflow-x-auto whitespace-nowrap pb-1 scrollbar-hide">
          <button className="flex items-center gap-1.5 sm:gap-2 border-b-2 border-bioclube-dark pb-3 text-bioclube-dark">
            Todas <span className="rounded-full bg-bioclube-light px-2 py-0.5 text-[10px] sm:text-xs text-bioclube-textMain">24</span>
          </button>
          <button className="flex items-center gap-1.5 sm:gap-2 border-b-2 border-transparent pb-3 hover:text-bioclube-textMain transition-colors">
            Em curso <span className="rounded-full bg-bioclube-light px-2 py-0.5 text-[10px] sm:text-xs">3</span>
          </button>
          <button className="flex items-center gap-1.5 sm:gap-2 border-b-2 border-transparent pb-3 hover:text-bioclube-textMain transition-colors">
            Concluídas <span className="rounded-full bg-bioclube-light px-2 py-0.5 text-[10px] sm:text-xs">18</span>
          </button>
        </nav>

        <section className="rounded-xl border border-bioclube-border bg-white shadow-sm overflow-hidden mb-8">
          <div className="flex items-center justify-between border-b border-bioclube-border p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-bioclube-textMain hidden sm:block">Solicitações</h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none justify-center items-center gap-2 rounded-lg border border-bioclube-border px-3 py-2 sm:py-1.5 text-sm font-medium text-bioclube-textMain hover:bg-bioclube-light">Filtros</button>
              <button className="flex-1 sm:flex-none justify-center items-center gap-2 rounded-lg border border-bioclube-border px-3 py-2 sm:py-1.5 text-sm font-medium text-bioclube-textMain hover:bg-bioclube-light">Exportar</button>
            </div>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[700px] text-left text-sm text-bioclube-textSub">
              <thead className="bg-bioclube-light text-xs font-semibold uppercase text-bioclube-textSub border-b border-bioclube-border">
                <tr>
                  <th className="px-4 sm:px-6 py-3 sm:py-4">ID</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4">Gerador</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4">Vol.</th>
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
                <tr className="hover:bg-bioclube-light transition-colors">
                  <td className="px-4 sm:px-6 py-4 font-medium text-bioclube-textMain">SOL-2026-00985</td>
                  <td className="px-4 sm:px-6 py-4">Hotel Aurora</td>
                  <td className="px-4 sm:px-6 py-4">320 L</td>
                  <td className="px-4 sm:px-6 py-4">27/09 · 11:30</td>
                  <td className="px-4 sm:px-6 py-4"><span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 whitespace-nowrap">Em rota</span></td>
                  <td className="px-4 sm:px-6 py-4 text-right"><button className="p-2 -mr-2 text-bioclube-textSub hover:text-bioclube-textMain">⬢⬢⬢</button></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-bioclube-border p-4 gap-4">
             <span className="text-xs sm:text-sm text-bioclube-textSub text-center sm:text-left">1–2 de 24 registos</span>
             <div className="flex gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none rounded-lg border border-bioclube-border px-4 py-2 sm:py-1.5 text-sm font-medium text-bioclube-textMain hover:bg-bioclube-light">Anterior</button>
                <button className="flex-1 sm:flex-none rounded-lg border border-bioclube-border px-4 py-2 sm:py-1.5 text-sm font-medium text-bioclube-textMain hover:bg-bioclube-light">Próxima</button>
             </div>
          </div>
        </section>
      </main>
    </div>
  );
}
