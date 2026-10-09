import React from 'react';
import { Search, Bell, Droplet, FileText, Clock, Scale, Download } from 'lucide-react';

export default function Indicadores() {
  return (
    <div className="flex min-h-screen bg-bioclube-light font-sans text-bioclube-textMain">
      <aside className="hidden lg:flex lg:w-64 flex-shrink-0 bg-bioclube-dark text-white flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-2 mb-10">
            <span className="bg-bioclube-amber text-bioclube-dark font-bold px-2 py-0.5 rounded text-xs">BC</span>
            <span className="font-bold tracking-wider text-sm">BIOCIRCULAR</span>
          </div>
          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-bioclube-secondary rounded-md text-sm font-medium border-l-4 border-bioclube-amber">Indicadores</a>
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-bioclube-border px-4 md:px-8 flex items-center justify-between">
          <span className="text-xs text-bioclube-textSub">BIOCIRCULAR / <strong className="text-bioclube-textMain">Indicadores</strong></span>
          <div className="flex items-center gap-4"><Search className="w-4 h-4 text-gray-400" /><Bell className="w-4 h-4 text-gray-400" /></div>
        </header>

        <div className="p-4 md:p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Indicadores</h1>
              <p className="text-xs text-bioclube-textSub mt-1">Desempenho operacional e rastreabilidade · setembro de 2026</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-bioclube-border rounded-lg text-xs font-bold">Setembro 2026</button>
              <button className="px-4 py-2 bg-bioclube-dark text-white rounded-lg text-xs font-bold flex items-center gap-2">
                <Download className="w-4 h-4" /> Exportar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-bioclube-border shadow-sm">
              <div className="flex justify-between mb-2"><Droplet className="w-4 h-4 text-bioclube-amber" /><span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">+12,4%</span></div>
              <div className="text-2xl font-extrabold">38.420 L</div>
              <div className="text-[11px] text-bioclube-textSub mt-1">Volume coletado</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-bioclube-border shadow-sm">
              <div className="flex justify-between mb-2"><FileText className="w-4 h-4 text-blue-600" /><span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">+2,1%</span></div>
              <div className="text-2xl font-extrabold">94,8%</div>
              <div className="text-[11px] text-bioclube-textSub mt-1">Taxa de conclusão</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-bioclube-border shadow-sm">
              <div className="flex justify-between mb-2"><Clock className="w-4 h-4 text-blue-600" /><span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">-14 min</span></div>
              <div className="text-2xl font-extrabold">3h18</div>
              <div className="text-[11px] text-bioclube-textSub mt-1">Tempo médio</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-bioclube-border shadow-sm">
              <div className="flex justify-between mb-2"><Scale className="w-4 h-4 text-blue-600" /><span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">-0,08%</span></div>
              <div className="text-2xl font-extrabold">0,32%</div>
              <div className="text-[11px] text-bioclube-textSub mt-1">Divergência média</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}