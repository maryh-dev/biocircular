import React from 'react';
import { Search, Bell, Plus, FileText, Package, Calendar, Droplet } from 'lucide-react';

export default function DashboardGerador() {
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
            <div className="text-xs font-bold text-bioclube-amber">BS</div>
            <div className="text-sm font-bold">Bistrô da Serra</div>
            <div className="text-[10px] text-gray-400">Gerador</div>
          </div>

          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-bioclube-secondary rounded-md text-sm font-medium border-l-4 border-bioclube-amber">Dashboard</a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white text-sm font-medium">Solicitações</a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white text-sm font-medium">Recipientes</a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white text-sm font-medium">Histórico</a>
          </nav>
        </div>

        <div className="bg-bioclube-secondary/50 p-4 rounded-lg border border-gray-800/50">
          <p className="text-xs font-bold text-gray-300">Precisa de ajuda?</p>
          <p className="text-[11px] text-gray-400 mt-1">Consulte o suporte operacional.</p>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col">
        {/* Header Superior */}
        <header className="h-16 bg-white border-b border-bioclube-border px-4 md:px-8 flex items-center justify-between">
          <span className="text-xs text-bioclube-textSub">BIOCIRCULAR / <strong className="text-bioclube-textMain">Dashboard</strong></span>
          <div className="flex items-center gap-4">
            <Search className="w-4 h-4 text-gray-400 cursor-pointer" />
            <Bell className="w-4 h-4 text-gray-400 cursor-pointer" />
            <span className="text-xs font-medium text-gray-600 border-l pl-4">27 set 2026</span>
          </div>
        </header>

        {/* Corpo do Dashboard */}
        <div className="p-4 md:p-8 space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Olá, Bistrô da Serra</h1>
              <p className="text-xs text-bioclube-textSub mt-1">Acompanhe seus recipientes, solicitações e histórico de coleta.</p>
            </div>
            <button className="flex items-center gap-2 bg-bioclube-dark text-white px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-bioclube-secondary">
              <Plus className="w-4 h-4" /> Solicitar coleta
            </button>
          </div>

          {/* 4 Cards de Indicadores */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-bioclube-border shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <span className="p-2 bg-amber-50 text-bioclube-amber rounded-lg"><Droplet className="w-4 h-4" /></span>
                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">+18%</span>
              </div>
              <div className="text-2xl font-extrabold">2.840 L</div>
              <div className="text-[11px] text-bioclube-textSub mt-1">Volume destinado em 2026</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-bioclube-border shadow-sm">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg w-fit mb-3"><FileText className="w-4 h-4" /></div>
              <div className="text-2xl font-extrabold">18</div>
              <div className="text-[11px] text-bioclube-textSub mt-1">Coletas concluídas</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-bioclube-border shadow-sm">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg w-fit mb-3"><Calendar className="w-4 h-4" /></div>
              <div className="text-2xl font-extrabold">27 set</div>
              <div className="text-[11px] text-bioclube-textSub mt-1">Próxima coleta</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-bioclube-border shadow-sm">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg w-fit mb-3"><Package className="w-4 h-4" /></div>
              <div className="text-2xl font-extrabold">2</div>
              <div className="text-[11px] text-bioclube-textSub mt-1">Recipientes ativos</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}