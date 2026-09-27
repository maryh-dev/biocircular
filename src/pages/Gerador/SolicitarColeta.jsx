import React from 'react';
import { Search, Bell, ArrowLeft, AlertCircle, ArrowRight } from 'lucide-react';

export default function SolicitarColeta() {
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
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Solicitar coleta</h1>
            <p className="text-xs text-bioclube-textSub mt-1">Informe o recipiente e escolha a melhor janela para retirada.</p>
          </div>

          <div className="bg-white p-4 md:p-8 rounded-xl border border-bioclube-border shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-4 border-b pb-4 text-xs font-semibold">
                <span className="w-6 h-6 rounded-full bg-bioclube-dark text-white flex items-center justify-center">1</span> Recipiente
                <span className="text-gray-300">——</span>
                <span className="w-6 h-6 rounded-full bg-bioclube-amber text-bioclube-dark flex items-center justify-center">2</span> Data e janela
                <span className="text-gray-300">——</span>
                <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">3</span> Revisão
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Data preferencial</label>
                  <input type="text" defaultValue="27/09/2026" className="w-full p-3 border border-bioclube-border rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Janela de horário</label>
                  <select className="w-full p-3 border border-bioclube-border rounded-md text-sm bg-white">
                    <option>10:00–11:00</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Endereço</label>
                <input type="text" disabled defaultValue="Rua dos Pinheiros, 842 — São Paulo, SP" className="w-full p-3 border border-bioclube-border rounded-md text-sm bg-gray-50 text-gray-600" />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Observações para o coletor</label>
                <input type="text" placeholder="Ex.: acesso pela entrada lateral" className="w-full p-3 border border-bioclube-border rounded-md text-sm" />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>A disponibilidade final será confirmada pela operação.</span>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <button className="px-5 py-2.5 border border-bioclube-border rounded-md text-xs font-bold">Voltar</button>
                <button className="px-6 py-2.5 bg-bioclube-dark text-white rounded-md text-xs font-bold flex items-center gap-2">Revisar solicitação <ArrowRight className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Resumo Lateral */}
            <div className="bg-gray-50 p-6 rounded-xl border border-bioclube-border space-y-4">
              <h3 className="font-bold text-sm">Resumo</h3>
              <div className="text-xs space-y-3">
                <div><span className="text-bioclube-textSub block">GERADOR</span><strong>Bistrô da Serra — Pinheiros</strong></div>
                <div><span className="text-bioclube-textSub block">RECIPIENTE</span><strong>REC-00482 · Bombona 200 L</strong></div>
                <div><span className="text-bioclube-textSub block">VOLUME ESTIMADO</span><strong className="text-base text-bioclube-amber">180 L</strong></div>
                <div>
                  <span className="text-bioclube-textSub block mb-1">Ocupação estimada (90%)</span>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-bioclube-amber h-full w-[90%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}