import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Clock3, Droplet, MapPin, Navigation, Route } from 'lucide-react';
import RouteMap from '../../components/RouteMap.jsx';
import { observarRotaColetor } from '../../services/rotas.js';

export default function ColetorInicio({ session, onIniciarColeta }) {
  const [paradas, setParadas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const nome = session?.profile?.nome || 'Coletor';
  const primeiroNome = nome.trim().split(/\s+/)[0];
  const proximaParada = paradas[0];
  const volumeTotal = useMemo(
    () => paradas.reduce((total, parada) => total + (Number(parada.volumeLitros) || 0), 0),
    [paradas]
  );

  useEffect(() => {
    if (!session?.user?.uid) return undefined;

    const cancelar = observarRotaColetor(
      session.user.uid,
      (rota) => {
        setParadas(rota);
        setCarregando(false);
      },
      (error) => {
        console.error('Não foi possível carregar a rota do coletor:', error);
        setErro('Não foi possível carregar sua rota. Verifique a conexão ou fale com a operação.');
        setCarregando(false);
      }
    );

    return cancelar;
  }, [session?.user?.uid]);

  return (
    <main className="min-h-screen bg-bioclube-light px-4 py-6 text-bioclube-textMain sm:px-6 sm:py-9 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-7">
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700">Área do coletor</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-bioclube-dark sm:text-3xl">Olá, {primeiroNome}</h1>
          <p className="mt-2 text-sm text-bioclube-textSub">Acompanhe as paradas atribuídas e registre cada coleta.</p>
        </section>

        {erro && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{erro}</p>}

        <section className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-bioclube-border bg-white p-5 shadow-sm sm:p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><Route className="h-5 w-5" /></span>
            <p className="mt-5 text-3xl font-extrabold text-bioclube-dark">{carregando ? '…' : paradas.length}</p>
            <p className="mt-1 text-sm text-bioclube-textSub">coletas pendentes na sua rota</p>
          </article>
          <article className="rounded-2xl border border-bioclube-border bg-white p-5 shadow-sm sm:p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Droplet className="h-5 w-5" /></span>
            <p className="mt-5 text-3xl font-extrabold text-bioclube-dark">{volumeTotal.toLocaleString('pt-BR')} L</p>
            <p className="mt-1 text-sm text-bioclube-textSub">volume estimado nas paradas</p>
          </article>
        </section>

        {carregando ? (
          <p className="rounded-xl bg-white p-8 text-center text-sm text-bioclube-textSub">Carregando sua rota…</p>
        ) : !paradas.length ? (
          <section className="rounded-2xl border border-bioclube-border bg-white p-8 text-center shadow-sm">
            <Route className="mx-auto h-10 w-10 text-bioclube-textSub" />
            <h2 className="mt-4 text-lg font-bold">Nenhuma parada atribuída</h2>
            <p className="mt-2 text-sm text-bioclube-textSub">Quando a operação publicar uma rota para você, as coletas aparecerão aqui.</p>
          </section>
        ) : (
          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-4">
              {proximaParada && (
                <article className="rounded-2xl border border-bioclube-border bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Próxima parada · {proximaParada.ordemRota}</p>
                      <h2 className="mt-2 text-lg font-extrabold">{proximaParada.solicitanteNome || 'Gerador'}</h2>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800">
                      <Clock3 className="h-3.5 w-3.5" /> {proximaParada.janela || 'Horário não informado'}
                    </span>
                  </div>
                  <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-bioclube-textSub">
                    <MapPin className="mt-1 h-4 w-4 shrink-0" /> {proximaParada.endereco}
                  </p>
                  <p className="mt-2 text-xs text-bioclube-textSub">
                    Recipiente {proximaParada.recipienteCodigo} · estimativa {Number(proximaParada.volumeLitros) || 0} L
                  </p>
                  <button
                    type="button"
                    onClick={() => onIniciarColeta?.(proximaParada)}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-bioclube-dark px-4 py-3 text-sm font-bold text-white transition hover:bg-bioclube-secondary sm:w-auto"
                  >
                    <Navigation className="h-4 w-4" /> Iniciar coleta
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </article>
              )}

              <article className="rounded-2xl border border-bioclube-border bg-white p-5 shadow-sm sm:p-6">
                <h2 className="mb-4 text-base font-bold">Sequência de paradas</h2>
                <ol className="space-y-3">
                  {paradas.map((parada) => (
                    <li key={parada.id} className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bioclube-dark text-xs font-bold text-white">{parada.ordemRota}</span>
                      <div className="min-w-0 flex-1">
                        <strong className="block truncate text-sm">{parada.solicitanteNome || 'Gerador'}</strong>
                        <p className="mt-1 truncate text-xs text-bioclube-textSub">{parada.endereco}</p>
                        <p className="mt-1 text-[11px] text-bioclube-textSub">{parada.dataPreferencial || 'Data não informada'} · {parada.janela || 'Horário não informado'}</p>
                      </div>
                      <span className="shrink-0 text-xs font-semibold">{Number(parada.volumeLitros) || 0} L</span>
                    </li>
                  ))}
                </ol>
              </article>
            </div>
            <aside className="space-y-3">
              <h2 className="text-base font-bold">Mapa das paradas</h2>
              <RouteMap paradas={paradas} geometria={paradas.map((parada) => [parada.latitude, parada.longitude])} className="h-72 lg:h-[28rem]" />
              <p className="text-xs leading-5 text-bioclube-textSub">Traçado entre os pontos em linha reta; use um navegador de mapas para navegação pelas ruas.</p>
            </aside>
          </section>
        )}
      </div>
    </main>
  );
}
