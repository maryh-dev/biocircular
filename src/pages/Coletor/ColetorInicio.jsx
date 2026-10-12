import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Clock3, Droplet, MapPin, Navigation, Route, LocateFixed } from 'lucide-react';
import RouteMap from '../../components/RouteMap.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import { STATUS_SOLICITACAO } from '../../services/db.js';
import { observarRotaColetor } from '../../services/rotas.js';

function abrirGoogleMaps(parada) {
  if (!parada) return;

  const destino = Number.isFinite(parada.latitude) && Number.isFinite(parada.longitude)
    ? `${parada.latitude},${parada.longitude}`
    : encodeURIComponent(parada.endereco || 'Parada de coleta');

  window.open(`https://www.google.com/maps/dir/?api=1&destination=${destino}`, '_blank', 'noopener,noreferrer');
}

export default function ColetorInicio({ session, onIniciarColeta }) {
  const [paradas, setParadas] = useState([]);
  const [paradaSelecionadaId, setParadaSelecionadaId] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const nome = session?.profile?.nome || 'Coletor';
  const primeiroNome = nome.trim().split(/\s+/)[0];
  const proximaParada = paradas[0] || null;
  const paradaSelecionada = paradas.find((parada) => parada.id === paradaSelecionadaId) || proximaParada;
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
        setParadaSelecionadaId((atualId) => {
          if (atualId && rota.some((parada) => parada.id === atualId)) {
            return atualId;
          }

          return rota[0]?.id || null;
        });
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

  const detalhesParada = paradaSelecionada || proximaParada;

  return (
    <main className="min-h-screen bg-bioclube-light px-4 py-6 text-bioclube-textMain sm:px-6 sm:py-9 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-7">
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700">Área do coletor</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-bioclube-dark sm:text-3xl">Olá, {primeiroNome}</h1>
          <p className="mt-2 text-sm text-bioclube-textSub">Acompanhe as paradas atribuídas, selecione uma rota e registre cada coleta.</p>
        </section>

        {erro && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{erro}</p>}

        <section className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-bioclube-border bg-white p-5 shadow-sm sm:p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><Route className="h-5 w-5" /></span>
            <p className="mt-5 text-3xl font-extrabold text-bioclube-dark">{carregando ? '…' : paradas.length}</p>
            <p className="mt-1 text-sm text-bioclube-textSub">paradas atribuídas na rota</p>
          </article>
          <article className="rounded-2xl border border-bioclube-border bg-white p-5 shadow-sm sm:p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Droplet className="h-5 w-5" /></span>
            <p className="mt-5 text-3xl font-extrabold text-bioclube-dark">{volumeTotal.toLocaleString('pt-BR')} L</p>
            <p className="mt-1 text-sm text-bioclube-textSub">volume estimado total</p>
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
          <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="space-y-4">
              <article className="rounded-2xl border border-bioclube-border bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-700">Próxima parada · {proximaParada.ordemRota || 1}</p>
                    <h2 className="mt-2 text-lg font-extrabold">{proximaParada.solicitanteNome || 'Gerador'}</h2>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800">
                    <Clock3 className="h-3.5 w-3.5" /> {proximaParada.janela || 'Horário não informado'}
                  </span>
                </div>

                <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-bioclube-textSub">
                  <MapPin className="mt-1 h-4 w-4 shrink-0" />
                  {proximaParada.endereco}
                </p>

                <div className="mt-4 flex flex-wrap gap-3 text-xs text-bioclube-textSub">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1.5 font-semibold">Recipiente {proximaParada.recipienteCodigo || '—'}</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1.5 font-semibold">{Number(proximaParada.volumeLitros) || 0} L</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1.5 font-semibold">{STATUS_SOLICITACAO[proximaParada.status] || 'Status'}</span>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => onIniciarColeta?.(proximaParada)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-bioclube-dark px-4 py-3 text-sm font-bold text-white transition hover:bg-bioclube-secondary"
                  >
                    <Navigation className="h-4 w-4" /> Iniciar coleta
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => abrirGoogleMaps(proximaParada)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-bioclube-border bg-white px-4 py-3 text-sm font-bold text-bioclube-dark transition hover:bg-slate-50"
                  >
                    <LocateFixed className="h-4 w-4" /> Navegar até a próxima parada
                  </button>
                </div>
              </article>

              <article className="rounded-2xl border border-bioclube-border bg-white p-5 shadow-sm sm:p-6">
                <h2 className="mb-4 text-base font-bold">Rota do coletor</h2>
                <ol className="space-y-3">
                  {paradas.map((parada) => {
                    const selecionada = paradaSelecionada?.id === parada.id;
                    const status = parada.status || 'agendada';

                    return (
                      <li key={parada.id}>
                        <button
                          type="button"
                          onClick={() => setParadaSelecionadaId(parada.id)}
                          className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition ${
                            selecionada
                              ? 'border-amber-200 bg-amber-50 shadow-sm'
                              : 'border-transparent bg-slate-50 hover:border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bioclube-dark text-xs font-bold text-white">
                            {parada.ordemRota || 1}
                          </span>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <strong className="block truncate text-sm text-bioclube-textMain">{parada.solicitanteNome || 'Gerador'}</strong>
                              <StatusBadge status={status} />
                            </div>
                            <p className="mt-2 truncate text-xs text-bioclube-textSub">{parada.endereco}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-bioclube-textSub">
                              <span>Recipiente {parada.recipienteCodigo || '—'}</span>
                              <span>•</span>
                              <span>{Number(parada.volumeLitros) || 0} L</span>
                            </div>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </article>
            </div>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-bioclube-border bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-base font-bold">Mapa da rota</h2>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-bioclube-textSub">
                    {paradas.length} pontos
                  </span>
                </div>

                <RouteMap
                  paradas={paradas}
                  geometria={paradas.map((parada) => [parada.latitude, parada.longitude])}
                  className="h-72 lg:h-[26rem]"
                  selectedParadaId={paradaSelecionada?.id || null}
                  onSelectParada={setParadaSelecionadaId}
                />
              </div>

              <div className="rounded-2xl border border-bioclube-border bg-white p-5 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-amber-700">Detalhes da parada</p>
                <h3 className="mt-2 text-lg font-extrabold">
                  {detalhesParada?.solicitanteNome || 'Gerador'}
                </h3>

                <div className="mt-4 space-y-3 text-sm text-bioclube-textSub">
                  <p className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                    <span>{detalhesParada?.endereco || 'Endereço não informado'}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Route className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                    <span>Recipiente: {detalhesParada?.recipienteCodigo || '—'}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                    <span>{detalhesParada?.janela || 'Horário não informado'}</span>
                  </p>
                </div>

                <div className="mt-4">
                  <StatusBadge status={detalhesParada?.status || 'agendada'} />
                </div>

                <button
                  type="button"
                  onClick={() => abrirGoogleMaps(detalhesParada)}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-bioclube-dark px-4 py-3 text-sm font-bold text-white transition hover:bg-bioclube-secondary"
                >
                  <Navigation className="h-4 w-4" /> Navegar até a próxima parada
                </button>
              </div>
            </aside>
          </section>
        )}
      </div>
    </main>
  );
}
