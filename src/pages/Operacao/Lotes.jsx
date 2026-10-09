import React from 'react';
import { Search, Bell, Plus } from 'lucide-react';

export default function Lotes() {
  return (
    <div className="flex min-h-screen bg-bioclube-light font-sans text-bioclube-textMain">
      <aside className="hidden lg:flex lg:w-64 flex-shrink-0 bg-bioclube-dark text-white flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-2 mb-10">
            <span className="bg-bioclube-amber text-bioclube-dark font-bold px-2 py-0.5 rounded text-xs">BC</span>
            <span className="font-bold tracking-wider text-sm">BIOCIRCULAR</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-bioclube-border px-4 md:px-8 flex items-center justify-between">
          <span className="text-xs text-bioclube-textSub">BIOCIRCULAR / <strong className="text-bioclube-textMain">Lotes</strong></span>
          <div className="flex items-center gap-4"><Search className="w-4 h-4 text-gray-400" /><Bell className="w-4 h-4 text-gray-400" /></div>
        </header>

        <div className="p-4 md:p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Lotes</h1>
              <p className="text-xs text-bioclube-textSub mt-1">Consolide coletas e acompanhe transporte, recebimento e destinação.</p>
            </div>
            <button className="flex items-center gap-2 bg-bioclube-dark text-white px-4 py-2.5 rounded-lg text-xs font-bold"><Plus className="w-4 h-4" /> Criar lote</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-bioclube-border shadow-sm"><span className="text-2xl font-extrabold">6</span><p className="text-[11px] text-bioclube-textSub mt-1">Em transporte</p></div>
            <div className="bg-white p-5 rounded-xl border border-bioclube-border shadow-sm"><span className="text-2xl font-extrabold">4</span><p className="text-[11px] text-bioclube-textSub mt-1">Recebidos hoje</p></div>
            <div className="bg-white p-5 rounded-xl border border-bioclube-border shadow-sm"><span className="text-2xl font-extrabold">7.840 L</span><p className="text-[11px] text-bioclube-textSub mt-1">Volume em trânsito</p></div>
            <div className="bg-white p-5 rounded-xl border border-bioclube-border shadow-sm"><span className="text-2xl font-extrabold">1</span><p className="text-[11px] text-bioclube-textSub mt-1">Pendências</p></div>
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
                  <td className="py-4 font-bold">LOT-2026-00142</td>
                  <td className="py-4">Rota SP-08</td>
                  <td className="py-4">1.240 L</td>
                  <td className="py-4">27/09 · 16:40</td>
                  <td className="py-4">Carlos Almeida</td>
                  <td className="py-4"><span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full font-bold">Em transporte</span></td>
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