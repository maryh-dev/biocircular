import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import CollectorShell from '../../components/CollectorShell';
import { useNavigate } from '../../components/NavigationContext';

export default function RegistrarQuantidade() {
  const navigate = useNavigate();
  return (
    <CollectorShell title="Registrar quantidade">
      <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
        <div className="flex gap-2" aria-label="Progresso da coleta">
          <span className="h-1 flex-1 rounded-full bg-green-600" />
          <span className="h-1 flex-1 rounded-full bg-bioclube-amber" />
          <span className="h-1 flex-1 rounded-full bg-slate-200" />
          <span className="text-xs text-bioclube-textSub">2/3</span>
        </div>

        <section className="rounded-xl border border-bioclube-border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-bold">
            <CheckCircle2 className="h-5 w-5 text-green-700" aria-hidden="true" />
            REC-00482 confirmado
          </div>
          <p className="mt-1 pl-7 text-xs text-bioclube-textSub">Bombona · capacidade 200 L</p>
        </section>

        <label className="block text-center text-sm font-bold" htmlFor="collected-quantity">
          Quantidade coletada
          <span className="mt-2 flex items-center justify-center gap-2 rounded-xl border-2 border-bioclube-amber bg-white px-4 py-5 text-5xl font-black">
            <input id="collected-quantity" type="number" defaultValue="176" min="0" className="w-40 bg-transparent text-right outline-none" aria-describedby="quantity-help" />
            <span className="text-2xl font-normal text-bioclube-textSub">L</span>
          </span>
        </label>
        <p id="quantity-help" className="text-center text-xs font-medium text-green-700">4 L abaixo da estimativa · dentro da tolerância</p>

        <label className="block text-sm font-semibold" htmlFor="collection-note">
          Observação
          <input id="collection-note" type="text" placeholder="Opcional" className="mt-2 min-h-12 w-full rounded-lg border border-bioclube-border bg-white px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-bioclube-amber" />
        </label>

        <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-xs text-blue-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
          <span>Confirme a quantidade medida antes de prosseguir.</span>
        </div>

        <button type="submit" onClick={() => navigate('coletor-concluida')} className="min-h-12 w-full rounded-lg bg-bioclube-dark px-4 py-3 text-sm font-bold text-white hover:bg-bioclube-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-bioclube-amber">
          Confirmar quantidade
        </button>
      </form>
    </CollectorShell>
  );
}
