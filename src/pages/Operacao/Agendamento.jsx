import React from 'react';
import { Search, Bell, Calendar, AlertTriangle } from 'lucide-react';

export default function Agendamento() {
  return (
    <div className="flex min-h-screen bg-bioclube-light font-sans text-bioclube-textMain">
      <aside className="hidden lg:flex lg:w-64 flex-shrink-0 bg-bioclube-dark text-white flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-2 mb-10">
            <span className="bg-bioclube-amber text-bioclube-dark font-bold px-2 py-0.5 rounded text-xs">BC</span>
            <span className="font-bold tracking-wider text-sm">BIOCIRCULAR</span>
          </div>
          <div className="bg-bioclube-secondary p-3 rounded-lg mb-6 border border-gray-800">
            <div className="text-xs font-bold text-bioclube-amber">MO</div>
            <div className="text-sm font-bold">Marina Oliveira</div>
            <div className="text-[10px] text-gray-400">Operação</div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-bioclube-border px-4 md:px-8 flex items-center justify-between">
          <span className="text-xs text-bioclube-textSub">BIOCIRCULAR / <strong className="text-bioclube-textMain">Solicitações</strong></span>
          <div className="flex items-center gap-4"><Search className="w-4 h-4 text-gray-400" /><Bell className="w-4 h-4 text-gray-400" /></div>
        </header>

        <div className="p-4 md:p-8 space-y-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Agendar SOL-2026-00984</h1>
            <p className="text-xs text-bioclube-textSub mt-1">Defina janela, coletor e rota prevista.</p>
          </div>

          <div className="bg-white p-4 md:p-8 rounded-xl border border-bioclube-border shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="font-bold text-sm">Dados do agendamento</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Data da coleta</label>
                  <input type="text" defaultValue="27/09/2026" className="w-full p-3 border border-bioclube-border rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Janela</label>
                  <select className="w-full p-3 border border-bioclube-border rounded-md text-sm bg-white">
                    <option>10:00–11:00</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Coletor</label>
                  <select className="w-full p-3 border border-bioclube-border rounded-md text-sm bg-white">
                    <option>Carlos Almeida</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Veículo</label>
                  <select className="w-full p-3 border border-bioclube-border rounded-md text-sm bg-white">
                    <option>VUC · ABC-4D28</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Rota prevista</label>
                <select className="w-full p-3 border border-bioclube-border rounded-md text-sm bg-white">
                  <option>Rota SP-08 · Pinheiros / Vila Madalena</option>
                </select>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Carlos Almeida possui 4 coletas na rota, com capacidade disponível de 860 L.</span>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <button className="px-5 py-2.5 border border-bioclube-border rounded-md text-xs font-bold">Cancelar</button>
                <button className="px-6 py-2.5 bg-bioclube-dark text-white rounded-md text-xs font-bold flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Confirmar agendamento
                </button>
              </div>
            </div>

            {/* Resumo */}
            <div className="bg-gray-50 p-6 rounded-xl border border-bioclube-border space-y-4">
              <h3 className="font-bold text-sm">Resumo</h3>
              <div className="text-xs space-y-3">
                <div><span className="text-bioclube-textSub block">SOLICITAÇÃO</span><strong>SOL-2026-00984</strong></div>
                <div><span className="text-bioclube-textSub block">GERADOR</span><strong>Bistrô da Serra</strong></div>
                <div><span className="text-bioclube-textSub block">ESTIMATIVA</span><strong>180 L</strong></div>
                <div><span className="text-bioclube-textSub block">RECIPIENTE</span><strong>REC-00482</strong></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}