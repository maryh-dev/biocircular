import React, { useState } from 'react';
import { AlertTriangle, ArrowLeft, CheckCircle2, Droplet } from 'lucide-react';
import { registrarColeta } from '../../services/rotas.js';

export default function RegistrarQuantidade({
  coletaAtual,
  codigoRecipiente,
  session,
  onNavigate,
}) {
  const [volume, setVolume] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  async function confirmar(event) {
    event.preventDefault();
    setErro('');
    setSalvando(true);

    try {
      await registrarColeta(coletaAtual, codigoRecipiente, volume, session.user, session.profile?.nome);
      onNavigate?.('coletor-inicio');
    } catch (error) {
      console.error('Não foi possível registrar a coleta:', error);
      setErro(error.message || 'Não foi possível registrar a coleta. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  if (!coletaAtual || !codigoRecipiente) {
    return (
      <main className="mx-auto min-h-[70vh] max-w-2xl px-4 py-10">
        <section className="rounded-2xl border border-bioclube-border bg-white p-6 text-center shadow-sm">
          <AlertTriangle className="mx-auto h-10 w-10 text-amber-700" />
          <h1 className="mt-4 text-xl font-bold">Valide o recipiente primeiro</h1>
          <p className="mt-2 text-sm text-bioclube-textSub">A quantidade só pode ser registrada depois que o QR Code da parada for conferido.</p>
          <button type="button" onClick={() => onNavigate?.('coletor-qr')} className="mt-5 rounded-lg bg-bioclube-dark px-4 py-2.5 text-sm font-bold text-white">
            Ler QR Code
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bioclube-light px-4 py-6 text-bioclube-textMain sm:px-6 sm:py-10">
      <div className="mx-auto max-w-xl space-y-5">
        <button type="button" onClick={() => onNavigate?.('coletor-qr')} className="inline-flex items-center gap-2 text-sm font-semibold text-bioclube-dark">
          <ArrowLeft className="h-4 w-4" /> Voltar para leitura do QR
        </button>
        <form onSubmit={confirmar} className="space-y-5 rounded-2xl border border-bioclube-border bg-white p-5 shadow-sm sm:p-7">
          <header className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Droplet className="h-6 w-6" /></span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Recipiente confirmado</p>
              <h1 className="mt-1 text-xl font-extrabold">Registrar quantidade</h1>
              <p className="mt-1 text-sm text-bioclube-textSub">{coletaAtual.solicitanteNome || 'Gerador'} · {coletaAtual.endereco}</p>
            </div>
          </header>

          <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>QR validado: <strong className="font-mono">{codigoRecipiente}</strong></span>
          </div>

          <div>
            <label htmlFor="volume-coletado" className="mb-2 block text-sm font-semibold">Volume realmente coletado</label>
            <div className="flex items-center gap-2">
              <input
                id="volume-coletado"
                type="number"
                inputMode="decimal"
                min="0.01"
                step="0.01"
                required
                autoFocus
                value={volume}
                onChange={(event) => setVolume(event.target.value)}
                placeholder="Ex.: 176"
                className="min-w-0 flex-1 rounded-lg border border-bioclube-border px-3 py-3 text-lg font-semibold"
              />
              <span className="text-sm font-bold text-bioclube-textSub">litros</span>
            </div>
            <p className="mt-2 text-xs text-bioclube-textSub">
              Volume estimado pelo gerador: {Number(coletaAtual.volumeLitros) || 0} L
            </p>
          </div>

          {erro && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{erro}</p>}
          <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <p>Ao confirmar, esta parada será marcada como coletada e sairá da sua rota pendente. Confira a medição antes de prosseguir.</p>
          </div>
          <button
            type="submit"
            disabled={salvando || !Number(volume)}
            className="w-full rounded-xl bg-bioclube-dark px-4 py-3 text-sm font-bold text-white transition hover:bg-bioclube-secondary disabled:opacity-60"
          >
            {salvando ? 'Salvando coleta…' : 'Confirmar coleta'}
          </button>
        </form>
      </div>
    </main>
  );
}
