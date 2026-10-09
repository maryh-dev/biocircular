import React from 'react';
import { Search, Bell, Download, Plus } from 'lucide-react';

export default function RecipienteDetalhes() {
  return (
    <div className="flex min-h-screen bg-bioclube-light font-sans text-bioclube-textMain">
      <aside className="hidden lg:flex lg:w-64 flex-shrink-0 bg-bioclube-dark text-white flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-2 mb-10">
            <span className="bg-bioclube-amber text-bioclube-dark font-bold px-2 py-0.5 rounded text-xs">BC</span>
            <span className="font-bold tracking-wider text-sm">BIOCIRCULAR</span>
          </div>
          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-bioclube-secondary rounded-md text-sm font-medium border-l-4 border-bioclube-amber">Recipientes</a>
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-bioclube-border px-4 md:px-8 flex items-center justify-between">
          <span className="text-xs text-bioclube-textSub">BIOCIRCULAR / <strong className="text-bioclube-textMain">Recipientes</strong></span>
          <div className="flex items-center gap-4"><Search className="w-4 h-4 text-gray-400" /><Bell className="w-4 h-4 text-gray-400" /></div>
        </header>

        <div className="p-4 md:p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Recipiente REC-00482</h1>
              <p className="text-xs text-bioclube-textSub mt-1">Identificação, capacidade e histórico de movimentações.</p>
            </div>
            <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">Ativo</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Bloco QR Code */}
            <div className="bg-white p-6 rounded-xl border border-bioclube-border shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-48 h-48 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xs text-gray-400">[ QR CODE REC-00482 ]</span>
              </div>
              <h3 className="font-bold text-sm">REC-00482</h3>
              <p className="text-[11px] text-bioclube-textSub mb-4">Bombona 200 L · Bistrô da Serra</p>
              <button className="w-full py-2 border border-bioclube-border rounded-lg text-xs font-bold flex items-center justify-center gap-2">
                <Download className="w-3.5 h-3.5" /> Baixar etiqueta
              </button>
            </div>

            {/* Informações do Recipiente */}
            <div className="col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-bioclube-border shadow-sm space-y-4">
                <h3 className="font-bold text-sm">Dados do recipiente</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div><span className="text-bioclube-textSub block">TIPO</span><strong>Bombona plástica</strong></div>
                  <div><span className="text-bioclube-textSub block">CAPACIDADE</span><strong>200 L</strong></div>
                  <div><span className="text-bioclube-textSub block">INSTALADO EM</span><strong>12/03/2026</strong></div>
                  <div><span className="text-bioclube-textSub block">LOCALIZAÇÃO</span><strong>Cozinha · doca lateral</strong></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-bioclube-textSub">Volume estimado</span>
                    <strong>180 de 200 L</strong>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
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