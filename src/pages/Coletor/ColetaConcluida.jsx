import React from 'react';
import { CheckCircle2, Navigation } from 'lucide-react';
import CollectorShell from '../../components/CollectorShell';
import { useNavigate } from '../../components/NavigationContext';

export default function ColetaConcluida() {
  const navigate = useNavigate();

  return (
    <CollectorShell title="Coleta concluída">
      <div className="flex min-h-[calc(100vh-7rem)] flex-col items-center text-center">
        <div className="mt-6 rounded-full bg-green-50 p-6 text-green-700">
          <CheckCircle2 className="h-10 w-10" aria-hidden="true" />
        </div>
        <h2 className="mt-6 text-2xl font-extrabold">Coleta registrada</h2>
        <p className="mt-2 max-w-xs text-sm text-bioclube-textSub">
          O recipiente REC-00482 foi confirmado e 176 L foram adicionados à rota SP-08.
        </p>

        <section className="mt-6 w-full rounded-xl border border-bioclube-border bg-white p-4 text-left shadow-sm">
          <div className="flex items-center justify-between">
            <strong className="text-sm">COL-2026-00417</strong>
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">Coletada</span>
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-xs uppercase text-bioclube-textSub">Gerador</dt><dd>Bistrô da Serra</dd></div>
            <div><dt className="text-xs uppercase text-bioclube-textSub">Quantidade</dt><dd>176 L</dd></div>
            <div><dt className="text-xs uppercase text-bioclube-textSub">Horário</dt><dd>10:18</dd></div>
            <div><dt className="text-xs uppercase text-bioclube-textSub">Coletor</dt><dd>Carlos Almeida</dd></div>
          </dl>
        </section>

        <div className="mt-4 w-full rounded-lg bg-blue-50 p-3 text-left text-xs text-blue-900">
          Próxima parada: Hotel Aurora · chegada estimada 11:24
        </div>

        <button type="button" onClick={() => navigate('coletor-inicio')} className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-bioclube-dark px-4 py-3 text-sm font-bold text-white hover:bg-bioclube-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-bioclube-amber">
          <Navigation className="h-4 w-4" aria-hidden="true" /> Ir para próxima coleta
        </button>
      </div>
    </CollectorShell>
  );
}
