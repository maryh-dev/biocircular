import React from 'react';
import { Search, Bell, Plus, Filter, Download } from 'lucide-react';

export default function MinhasSolicitacoes() {
  return (
    <div className="flex min-h-screen bg-bioclube-light font-sans text-bioclube-textMain">
      <aside className="hidden lg:flex lg:w-64 flex-shrink-0 bg-bioclube-dark text-white flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-2 mb-10">
            <span className="bg-bioclube-amber text-bioclube-dark font-bold px-2 py-0.5 rounded text-xs">BC</span>
            <span className="font-bold tracking-wider text-sm">BIOCIRCULAR</span>
          </div>
          <div className="bg-bioclube-secondary p-3 rounded-lg mb-6 border border-gray-800">
            <div className="text-xs font-bold text-bioclube-amber">BS</div>
            <div className="text-sm font-bold">Bistrô da Serra</div>
            <div className="text-[10px] text-gray-400">Gerador</div>
          </div>
          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white text-sm font-medium">Dashboard</a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-bioclube-secondary rounded-md text-sm font-medium border-l-4 border-bioclube-amber">Solicitações</a>
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-bioclube-border px-4 md:px-8 flex items-center justify-between">
          <span className="text-xs text-bioclube-textSub">BIOCIRCULAR / <strong className="text-bioclube-textMain">Solicitações</strong></span>
          <div className="flex items-center gap-4"><Search className="w-4 h-4 text-gray-400" /><Bell className="w-4 h-4 text-gray-400" /></div>
        </header>

        <div className="p-4 md:p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Minhas solicitações</h1>
              <p className="text-xs text-bioclube-textSub mt-1">Consulte status, volumes e responsáveis por suas coletas.</p>
            </div>
            <button className="flex items-center gap-2 bg-bioclube-dark text-white px-4 py-2.5 rounded-lg text-xs font-bold"><Plus className="w-4 h-4" /> Nova solicitação</button>
          </div>

          <div className="flex gap-2 border-b border-bioclube-border pb-3 text-xs font-bold">
            <span className="px-3 py-1.5 bg-white border rounded-md shadow-sm">Todas <span className="text-gray-400 ml-1">24</span></span>
            <span className="px-3 py-1.5 text-gray-500">Em andamento <span className="bg-gray-100 px-1.5 rounded ml-1">3</span></span>
            <span className="px-3 py-1.5 text-gray-500">Concluídas <span className="bg-gray-100 px-1.5 rounded ml-1">18</span></span>
          </div>

          <div className="bg-white rounded-xl border border-bioclube-border shadow-sm p-4 md:p-6">
            <div className="overflow-x-auto">
              <table className="min-w-[760px] w-full text-left text-xs">
              <thead>
                <tr className="border-b text-bioclube-textSub pb-2">
                  <th className="pb-3">IDENTIFICAÇÃO</th>
                  <th className="pb-3">ORIGEM / GERADOR</th>
                  <th className="pb-3">QUANTIDADE</th>
                  <th className="pb-3">DATA</th>
                  <th className="pb-3">RESPONSÁVEL</th>
                  <th className="pb-3">STATUS</th>
                  <th className="pb-3 text-right">AÇÕES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bioclube-border">
                <tr>
                  <td className="py-4 font-bold">SOL-2026-00984</td>
                  <td className="py-4">Bistrô da Serra</td>
                  <td className="py-4">180 L</td>
                  <td className="py-4">27/09 · 10:00</td>
                  <td className="py-4">Carlos Almeida</td>
                  <td className="py-4"><span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full font-bold">Agendada</span></td>
                  <td className="py-4 text-right">•••</td>
                </tr>
                <tr>
                  <td className="py-4 font-bold">SOL-2026-00985</td>
                  <td className="py-4">Hotel Aurora</td>
                  <td className="py-4">320 L</td>
                  <td className="py-4">27/09 · 11:30</td>
                  <td className="py-4">João Lima</td>
                  <td className="py-4"><span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full font-bold">Em rota</span></td>
                  <td className="py-4 text-right">•••</td>
                </tr>
              </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}