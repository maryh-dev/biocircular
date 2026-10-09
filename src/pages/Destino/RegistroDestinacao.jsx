import React from 'react';
import { Search, Bell, CheckCircle2, ArrowRight } from 'lucide-react';

export default function RegistroDestinacao() {
  return (
    <div className="flex min-h-screen bg-bioclube-light font-sans text-bioclube-textMain">
      {/* Sidebar Esquerda */}
      <aside className="hidden lg:flex lg:w-64 flex-shrink-0 bg-bioclube-dark text-white flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-2 mb-10">
            <span className="bg-bioclube-amber text-bioclube-dark font-bold px-2 py-0.5 rounded text-xs">BC</span>
            <span className="font-bold tracking-wider text-sm">BIOCIRCULAR</span>
          </div>
          <div className="bg-bioclube-secondary p-3 rounded-lg mb-6 border border-gray-800">
            <div className="text-xs font-bold text-bioclube-amber">DP</div>
            <div className="text-sm font-bold">Destino Paulista</div>
            <div className="text-[10px] text-gray-400">Destino</div>
          </div>
          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white text-sm font-medium">Dashboard</a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white text-sm font-medium">Recebimentos</a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-bioclube-secondary rounded-md text-sm font-medium border-l-4 border-bioclube-amber">Destinação</a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white text-sm font-medium">Lotes</a>
          </nav>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col">
        {/* Header Superior */}
        <header className="h-16 bg-white border-b border-bioclube-border px-4 md:px-8 flex items-center justify-between">
          <span className="text-xs text-bioclube-textSub">BIOCIRCULAR / <strong className="text-bioclube-textMain">Destinação</strong></span>
          <div className="flex items-center gap-4">
            <Search className="w-4 h-4 text-gray-400 cursor-pointer" />
            <Bell className="w-4 h-4 text-gray-400 cursor-pointer" />
            <span className="text-xs font-medium text-gray-600 border-l pl-4">27 set 2026</span>
          </div>
        </header>

        {/* Corpo da Página */}
        <div className="p-4 md:p-8 space-y-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Registrar destinação</h1>
            <p className="text-xs text-bioclube-textSub mt-1">Lote LOT-2026-00142 · 1.238 L recebidos</p>
          </div>

          <div className="bg-white p-4 md:p-8 rounded-xl border border-bioclube-border shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Passos do Processo */}
              <div className="flex items-center gap-4 border-b pb-4 text-xs font-semibold">
                <span className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center">✓</span> Recebimento confirmado
                <span className="text-gray-300">——</span>
                <span className="w-6 h-6 rounded-full bg-bioclube-amber text-bioclube-dark flex items-center justify-center">2</span> Dados da destinação
                <span className="text-gray-300">——</span>
                <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">3</span> Revisão
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Data da destinação</label>
                  <input type="text" defaultValue="28/09/2026" className="w-full p-3 border border-bioclube-border rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Quantidade destinada</label>
                  <input type="text" defaultValue="1.238 L" className="w-full p-3 border border-bioclube-border rounded-md text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Destino / unidade</label>
                <input type="text" disabled defaultValue="Destino Paulista · Unidade Osasco" className="w-full p-3 border border-bioclube-border rounded-md text-sm bg-gray-50 text-gray-600" />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Registro operacional</label>
                <input type="text" defaultValue="Processamento para insumo industrial" className="w-full p-3 border border-bioclube-border rounded-md text-sm" />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Responsável pelo registro</label>
                <input type="text" defaultValue="Daniela Ramos" className="w-full p-3 border border-bioclube-border rounded-md text-sm" />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Observações</label>
                <input type="text" placeholder="Opcional" className="w-full p-3 border border-bioclube-border rounded-md text-sm" />
              </div>

              <div className="flex justify-between pt-4 border-t">
                <button className="px-5 py-2.5 border border-bioclube-border rounded-md text-xs font-bold hover:bg-gray-50">Voltar</button>
                <button className="px-6 py-2.5 bg-bioclube-dark text-white rounded-md text-xs font-bold flex items-center gap-2 hover:bg-bioclube-secondary">
                  Revisar registro <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Resumo Lateral */}
            <div className="bg-gray-50 p-6 rounded-xl border border-bioclube-border space-y-4">
              <h3 className="font-bold text-sm">Resumo</h3>
              <div className="text-xs space-y-3">
                <div><span className="text-bioclube-textSub block">LOTE</span><strong>LOT-2026-00142</strong></div>
                <div><span className="text-bioclube-textSub block">QUANTIDADE RECEBIDA</span><strong className="text-base text-bioclube-amber">1.238 L</strong></div>
                <div><span className="text-bioclube-textSub block">ORIGEM</span><strong>4 coletas · Rota SP-08</strong></div>
                <div><span className="text-bioclube-textSub block">RECEBIDO EM</span><strong>27/09/2026 · 17:22</strong></div>
                
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-[11px] text-blue-900 mt-4">
                  ⚠️ A confirmação encerra o ciclo de rastreabilidade do lote.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}