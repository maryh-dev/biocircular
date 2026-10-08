import React from 'react';
import { Search, Bell, Droplet, FileText, Clock, Scale, Download } from 'lucide-react';
import { useNavigate } from '../../components/NavigationContext';

export default function Indicadores() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-bioclube-light font-sans text-bioclube-textMain">
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