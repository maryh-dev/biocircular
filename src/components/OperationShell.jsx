import React, { useState } from 'react';
import {
  BarChart3,
  ChevronLeft,
  ClipboardList,
  Container,
  LayoutDashboard,
  Menu,
  Package,
  Route,
  Truck,
  X,
} from 'lucide-react';

const navigation = [
  ['op-dashboard', 'Dashboard', LayoutDashboard],
  ['op-solicitacoes', 'Solicitações', ClipboardList],
  ['op-detalhes', 'Detalhes da solicitação', ClipboardList],
  ['op-agendamento', 'Agendamento', ClipboardList],
  ['op-rota', 'Rotas', Route],
  ['op-lotes', 'Lotes', Package],
  ['op-indicadores', 'Indicadores', BarChart3],
  ['op-recebimento', 'Recebimentos', Container],
  ['coletor-inicio', 'Coletor', Truck],
  ['destino-reg', 'Destinação', Package],
];

export default function OperationShell({ currentScreen, onNavigate, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const navigate = (screen) => {
    setMobileOpen(false);
    onNavigate(screen);
  };

  return (
    <div className="flex min-h-screen bg-bioclube-light text-bioclube-textMain">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-bioclube-dark px-3 py-5 text-white transition-all duration-200 lg:static lg:translate-x-0 ${
          collapsed ? 'w-20' : 'w-72'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        aria-label="Navegação completa da operação"
      >
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-2`}>
          <button
            type="button"
            onClick={() => navigate('op-dashboard')}
            className="flex items-center gap-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-bioclube-amber"
            aria-label="Ir para o dashboard da operação"
          >
            <span className="rounded bg-bioclube-amber px-2 py-1 text-xs font-bold text-bioclube-dark">BC</span>
            {!collapsed && <span className="text-sm font-bold tracking-wide">BIOCIRCULAR</span>}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded p-2 text-slate-300 hover:bg-bioclube-secondary lg:hidden"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {!collapsed && (
          <div className="mt-8 rounded-lg bg-bioclube-secondary p-3">
            <p className="text-xs font-semibold">Marina Oliveira</p>
            <p className="mt-1 text-[11px] text-slate-300">Operação / MAV</p>
          </div>
        )}

        <nav className="mt-6 space-y-1" aria-label="Módulos operacionais">
          {navigation.map(([screen, label, Icon]) => (
            <button
              key={screen}
              type="button"
              onClick={() => navigate(screen)}
              title={collapsed ? label : undefined}
              aria-current={currentScreen === screen ? 'page' : undefined}
              className={`flex w-full items-center rounded-md py-3 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bioclube-amber ${
                collapsed ? 'justify-center px-2' : 'gap-3 px-3'
              } ${
                currentScreen === screen
                  ? 'border-r-2 border-bioclube-amber bg-bioclube-secondary font-semibold text-white'
                  : 'text-slate-300 hover:bg-bioclube-secondary/70 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {!collapsed && <span>{label}</span>}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-2">
          {!collapsed && (
            <div className="rounded-lg bg-bioclube-secondary p-3">
              <p className="text-xs font-semibold">Fluxo operacional</p>
              <p className="mt-1 text-[11px] text-slate-300">Da solicitação à destinação final.</p>
            </div>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            className="hidden w-full items-center justify-center gap-2 rounded-md bg-bioclube-secondary px-3 py-2 text-xs text-slate-200 hover:bg-slate-700 lg:flex"
            aria-label={collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} aria-hidden="true" />
            {!collapsed && 'Recolher menu'}
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Fechar navegação"
        />
      )}

      <div className="min-w-0 flex-1">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="fixed left-3 top-3 z-20 rounded bg-bioclube-dark p-2 text-white shadow lg:hidden"
          aria-label="Abrir menu da operação"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
        {children}
      </div>
    </div>
  );
}
