import React from 'react';
import { Home, Map, Droplet } from 'lucide-react';
import { useNavigate } from './NavigationContext';

export default function CollectorShell({ title, dark = false, children }) {
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen overflow-x-hidden ${dark ? 'bg-bioclube-dark' : 'bg-bioclube-light'} font-sans`}>
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden bg-inherit shadow-xl">
        <header
          className={`flex min-h-16 items-center justify-between gap-3 border-b px-4 py-3 sm:px-5 ${
            dark ? 'border-white/10 text-white' : 'border-bioclube-border bg-white text-bioclube-textMain'
          }`}
        >
          <button
            type="button"
            className="rounded p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-bioclube-amber"
            aria-label="Voltar"
            onClick={() => navigate('coletor-inicio')}
          >
            <span aria-hidden="true" className="text-xl">←</span>
          </button>
          <h1 className="min-w-0 truncate text-base font-bold">{title}</h1>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-bioclube-amber text-xs font-bold text-bioclube-dark">
            CA
          </span>
        </header>

        <main className="min-w-0 flex-1 overflow-y-auto px-4 py-5 sm:px-5">{children}</main>

        {!dark && (
          <nav className="grid min-h-16 grid-cols-3 border-t border-bioclube-border bg-white px-3 py-2" aria-label="Navegação do coletor">
            {[
              ['Início', Home, 'coletor-inicio'],
              ['Coletas', Droplet, 'coletor-inicio'],
              ['Rota', Map, 'op-rota'],
            ].map(([label, Icon, screen], index) => (
              <button
                key={label}
                type="button"
                onClick={() => navigate(screen)}
                className={`flex flex-col items-center justify-center gap-1 text-[11px] ${
                  index === 0 ? 'font-bold text-bioclube-dark' : 'text-bioclube-textSub'
                }`}
                aria-current={index === 0 ? 'page' : undefined}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
