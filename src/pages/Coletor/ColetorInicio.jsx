import React from 'react';
import { ChevronRight, MapPin, Navigation } from 'lucide-react';
import CollectorShell from '../../components/CollectorShell';
import { useNavigate } from '../../components/NavigationContext';

const upcomingStops = [
  ['11:30', 'Hotel Aurora', '320 L'],
  ['13:00', 'Cantina Central', '140 L'],
];

export default function ColetorInicio() {
  const navigate = useNavigate();
  return (
    <CollectorShell title="Início">
      <div className="space-y-4">
        <header>
          <h2 className="text-2xl font-extrabold">Bom dia, Carlos</h2>
          <p className="text-sm text-bioclube-textSub">Rota SP-08 · 27 de setembro</p>
        </header>

        <section className="grid grid-cols-2 gap-3" aria-label="Resumo da rota">
          <div className="rounded-xl border border-bioclube-border bg-white p-4 shadow-sm">
            <p className="text-2xl font-black">4</p>
            <p className="mt-1 text-xs text-bioclube-textSub">coletas</p>
          </div>
          <div className="rounded-xl border border-bioclube-border bg-white p-4 shadow-sm">
            <p className="text-2xl font-black">730 L</p>
            <p className="mt-1 text-xs text-bioclube-textSub">estimados</p>
          </div>
        </section>

        <article className="rounded-xl border border-bioclube-border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-bold text-amber-700">10:00–11:00</span>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">Agendada</span>
          </div>
          <h3 className="mt-5 text-lg font-bold">Bistrô da Serra</h3>
          <p className="mt-2 flex items-start gap-2 text-sm text-bioclube-textSub">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Rua dos Pinheiros, 842 · São Paulo
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div><dt className="text-xs uppercase text-bioclube-textSub">Estimativa</dt><dd>180 L</dd></div>
            <div><dt className="text-xs uppercase text-bioclube-textSub">Recipiente</dt><dd>REC-00482</dd></div>
          </dl>
          <button type="button" onClick={() => navigate('coletor-qr')} className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-bioclube-dark px-4 py-3 text-sm font-bold text-white hover:bg-bioclube-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-bioclube-amber">
            <Navigation className="h-4 w-4" aria-hidden="true" /> Iniciar rota
          </button>
        </article>

        <section aria-labelledby="after-stop-title">
          <h3 id="after-stop-title" className="text-xl font-bold">Depois desta</h3>
          <div className="mt-3 space-y-2">
            {upcomingStops.map(([time, name, volume]) => (
              <button key={name} type="button" className="flex min-h-14 w-full items-center gap-3 rounded-lg border border-bioclube-border bg-white px-3 text-left hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-bioclube-amber">
                <span className="text-sm font-bold text-amber-700">{time}</span>
                <span className="flex-1"><strong className="block text-sm">{name}</strong><small className="text-xs text-bioclube-textSub">{volume}</small></span>
                <ChevronRight className="h-4 w-4 text-bioclube-textSub" aria-hidden="true" />
              </button>
            ))}
          </div>
        </section>
      </div>
    </CollectorShell>
  );
}
