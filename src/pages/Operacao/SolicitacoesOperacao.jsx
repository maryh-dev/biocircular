import React from 'react';
import { Search, Bell, Plus, FileText, Calendar, GitPullRequest, AlertCircle } from 'lucide-react';

export default function SolicitacoesOperacao() {
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
          <nav className="space-y-1">
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
            <h1 className="text-xl md:text-2xl font-bold">Solicitações</h1>
            <p className="text-xs text-bioclube-textSub mt-1">Gerencie triagem, agendamento e atribuição de coletas.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-bioclube-border shadow-sm">
              <FileText className="w-4 h-4 text-blue-600 mb-2" />
              <div className="text-2xl font-extrabold">8</div>
              <div className="text-[11px] text-bioclube-textSub mt-1">Solicitadas</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-bioclube-border shadow-sm">
              <Calendar className="w-4 h-4 text-blue-600 mb-2" />
              <div className="text-2xl font-extrabold">12</div>
              <div className="text-[11px] text-bioclube-textSub mt-1">Agendadas</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-bioclube-border shadow-sm">
              <GitPullRequest className="w-4 h-4 text-blue-600 mb-2" />
              <div className="text-2xl font-extrabold">7</div>
              <div className="text-[11px] text-bioclube-textSub mt-1">Em rota</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-bioclube-border shadow-sm">
              <AlertCircle className="w-4 h-4 text-amber-600 mb-2" />
              <div className="text-2xl font-extrabold">3</div>
              <div className="text-[11px] text-bioclube-textSub mt-1">Pendentes</div>
            </div>
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
              </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}