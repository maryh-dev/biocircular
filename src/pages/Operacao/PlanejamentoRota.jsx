import React from 'react';
import { Search, Bell, MapPin } from 'lucide-react';

export default function PlanejamentoRota() {
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
          <span className="text-xs text-bioclube-textSub">BIOCIRCULAR / <strong className="text-bioclube-textMain">Rotas</strong></span>
          <div className="flex items-center gap-4"><Search className="w-4 h-4 text-gray-400" /><Bell className="w-4 h-4 text-gray-400" /></div>
        </header>

        <div className="p-4 md:p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Planejamento de rota</h1>
              <p className="text-xs text-bioclube-textSub mt-1">Rota SP-08 · Pinheiros / Vila Madalena - 27/09/2026</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-bioclube-border rounded-lg text-xs font-bold">Otimizar sequência</button>
              <button className="px-4 py-2 bg-bioclube-dark text-white rounded-lg text-xs font-bold">Publicar rota</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-bioclube-border shadow-sm"><span className="text-2xl font-extrabold">4</span><p className="text-[11px] text-bioclube-textSub mt-1">Coletas</p></div>
            <div className="bg-white p-5 rounded-xl border border-bioclube-border shadow-sm"><span className="text-2xl font-extrabold">730 L</span><p className="text-[11px] text-bioclube-textSub mt-1">Volume estimado</p></div>
            <div className="bg-white p-5 rounded-xl border border-bioclube-border shadow-sm"><span className="text-2xl font-extrabold">28 km</span><p className="text-[11px] text-bioclube-textSub mt-1">Distância</p></div>
            <div className="bg-white p-5 rounded-xl border border-bioclube-border shadow-sm"><span className="text-2xl font-extrabold">3h20</span><p className="text-[11px] text-bioclube-textSub mt-1">Duração prevista</p></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-bioclube-border shadow-sm space-y-4">
              <h3 className="font-bold text-sm">Sequência de coletas</h3>
              <div className="bg-gray-50 p-3 rounded-lg text-xs font-bold">Carlos Almeida · VUC ABC-4D28</div>
              <div className="space-y-2">
                <div className="p-3 bg-white border border-bioclube-border rounded-lg flex items-center justify-between text-xs">
                  <div><strong>1. Bistrô da Serra</strong><span className="block text-[10px] text-bioclube-textSub">10:00 - 180 L</span></div>
                </div>
                <div className="p-3 bg-white border border-bioclube-border rounded-lg flex items-center justify-between text-xs">
                  <div><strong>2. Hotel Aurora</strong><span className="block text-[10px] text-bioclube-textSub">11:30 - 320 L</span></div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-bioclube-border shadow-sm flex items-center justify-center bg-gray-100">
              <span className="text-xs text-gray-500">[ COMPONENTE DE MAPA LEAFLET ]</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}