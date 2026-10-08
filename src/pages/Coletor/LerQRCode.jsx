import React from 'react';
import { Flashlight, Keyboard } from 'lucide-react';
import CollectorShell from '../../components/CollectorShell';
import { useNavigate } from '../../components/NavigationContext';

export default function LerQRCode() {
  const navigate = useNavigate();
  return (
    <CollectorShell title="Ler QR Code" dark>
      <div className="flex min-h-[calc(100vh-7rem)] flex-col items-center text-center text-white">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wide text-bioclube-amber">Etapa 1 de 3</p>
          <p className="max-w-xs text-sm text-slate-300">Posicione o código do recipiente dentro da moldura.</p>
        </div>

        <div className="relative mt-16 flex h-72 w-full max-w-xs items-center justify-center rounded-2xl border-2 border-bioclube-amber bg-white/5" aria-label="Área de leitura do QR Code">
          <span className="absolute h-0.5 w-4/5 bg-bioclube-amber" aria-hidden="true" />
          <span className="h-14 w-14 rounded-xl border-2 border-bioclube-amber/80" aria-hidden="true" />
        </div>

        <div className="mt-16 flex gap-10">
          <button type="button" className="flex flex-col items-center gap-2 text-xs text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-bioclube-amber">
            <span className="rounded-full bg-[#16324F] p-4"><Flashlight className="h-5 w-5" aria-hidden="true" /></span>
            Lanterna
          </button>
          <button type="button" onClick={() => navigate('coletor-qtd')} className="flex flex-col items-center gap-2 text-xs text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-bioclube-amber">
            <span className="rounded-full bg-[#16324F] p-4"><Keyboard className="h-5 w-5" aria-hidden="true" /></span>
            Digitar código
          </button>
        </div>

        <p className="mt-auto pt-10 text-xs text-slate-400">SOL-2026-00984 · Bistrô da Serra</p>
      </div>
    </CollectorShell>
  );
}
