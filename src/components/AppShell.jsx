import React, { useState } from 'react';
import {
  ChevronDown,
  ClipboardList,
  Container,
  LayoutDashboard,
  Menu,
  Package,
  X,
} from 'lucide-react';

const navigation = [
  { id: 'gerador-dash', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'gerador-solicitar', label: 'Solicitações', icon: ClipboardList },
  { id: 'gerador-recipiente', label: 'Recipientes', icon: Container },
  { id: 'gerador-minhas', label: 'Histórico', icon: Package },
];

export default function AppShell({ currentScreen, onNavigate, children, chrome = true }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = (screen) => {
    onNavigate(screen);
    setMobileOpen(false);
  };

  if (!chrome) {
    return children;
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-bioclube-light text-bioclube-textMain">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-bioclube-dark px-4 py-5 text-white transition-transform lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Navegação principal"
      >
        <div className="flex items-center justify-between px-2">
          <button
            type="button"
            className="flex items-center gap-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-bioclube-amber"
            onClick={() => navigate('gerador-dash')}
            aria-label="Ir para o dashboard BIOCIRCULAR"
          >
            <span className="rounded bg-bioclube-amber px-2 py-1 text-xs font-bold text-bioclube-dark">BC</span>
            <span className="text-sm font-bold tracking-wide">BIOCIRCULAR</span>
          </button>
          <button
            type="button"
            className="rounded p-2 text-slate-300 hover:bg-bioclube-secondary lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-8 rounded-lg bg-[#16324F] p-3">
          <p className="text-xs font-semibold">Bistrô da Serra</p>
          <p className="mt-1 text-[11px] text-slate-300">Gerador</p>
        </div>

        <nav className="mt-6 space-y-1">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => navigate(id)}
              aria-current={currentScreen === id ? 'page' : undefined}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bioclube-amber ${
                currentScreen === id
                  ? 'border-r-2 border-bioclube-amber bg-bioclube-secondary font-semibold'
                  : 'text-slate-300 hover:bg-bioclube-secondary/70 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {label}
            </button>
          ))}
        </nav>

        <div className="mt-auto rounded-lg bg-[#16324F] p-3">
          <p className="text-xs font-semibold">Precisa de ajuda?</p>
          <p className="mt-1 text-[11px] text-slate-300">Consulte o suporte operacional.</p>
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

      <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:ml-0">
        <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-bioclube-border bg-white px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="rounded p-2 text-bioclube-textMain hover:bg-bioclube-light focus:outline-none focus-visible:ring-2 focus-visible:ring-bioclube-amber lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            <p className="truncate text-xs text-bioclube-textSub">
              BIOCIRCULAR <span aria-hidden="true">/</span>{' '}
              <span className="font-semibold text-bioclube-textMain">
                {navigation.find((item) => item.id === currentScreen)?.label || 'Dashboard'}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-bioclube-textSub">
            <button
              type="button"
              className="rounded p-2 hover:bg-bioclube-light focus:outline-none focus-visible:ring-2 focus-visible:ring-bioclube-amber"
              aria-label="Abrir notificações"
            >
              <ChevronDown className="h-4 w-4 rotate-180" aria-hidden="true" />
            </button>
            <span className="hidden sm:inline">27 set 2026</span>
          </div>
        </header>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
