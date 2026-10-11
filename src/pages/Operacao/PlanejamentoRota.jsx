import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Check, MapPin, Route, Truck } from 'lucide-react';
import RouteMap from '../../components/RouteMap.jsx';
import {
  observarColetores,
  observarSolicitacoesRota,
  otimizarSequencia,
  publicarRota,
} from '../../services/rotas.js';

const temCoordenadas = (parada) => (
  Number.isFinite(parada.latitude)
  && parada.latitude >= -90
  && parada.latitude <= 90
  && Number.isFinite(parada.longitude)
  && parada.longitude >= -180
  && parada.longitude <= 180
);

function formatarDistancia(metros) {
  return metros < 1000
    ? `${Math.round(metros)} m`
    : `${(metros / 1000).toFixed(1)} km`;
}

export default function PlanejamentoRota({ session }) {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [coletores, setColetores] = useState([]);
  const [selecionadas, setSelecionadas] = useState([]);
  const [coletorUid, setColetorUid] = useState('');
  const [plano, setPlano] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [publicando, setPublicando] = useState(false);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');

  useEffect(() => {
    const cancelarSolicitacoes = observarSolicitacoesRota(
      (lista) => {
        setSolicitacoes(lista);
        setCarregando(false);
      },
      (error) => {
        console.error('Não foi possível carregar as solicitações para a rota:', error);
        setErro('Não foi possível carregar as solicitações. Verifique as regras do Firestore.');
        setCarregando(false);
      }
    );
    const cancelarColetores = observarColetores(
      setColetores,
      (error) => {
        console.error('Não foi possível carregar os coletores:', error);
        setErro('Não foi possível carregar os coletores ativos.');
      }
    );

    return () => {
      cancelarSolicitacoes();
      cancelarColetores();
    };
  }, []);

  const elegiveis = useMemo(
    () => solicitacoes.filter((solicitacao) => (
      temCoordenadas(solicitacao) && Boolean(solicitacao.recipienteCodigo)
    )),
    [solicitacoes]
  );
  const semLocalizacao = solicitacoes.filter((solicitacao) => !temCoordenadas(solicitacao));
  const semRecipiente = solicitacoes.filter((solicitacao) => (
    temCoordenadas(solicitacao) && !solicitacao.recipienteCodigo
  ));
  const paradasSelecionadas = useMemo(
    () => elegiveis.filter((parada) => selecionadas.includes(parada.id)),
    [elegiveis, selecionadas]
  );

  function alternarParada(id) {
    setSelecionadas((atuais) => (
      atuais.includes(id)
        ? atuais.filter((item) => item !== id)
        : [...atuais, id]
    ));
    setPlano(null);
    setAviso('');
  }

  function ordenarPorData(paradas) {
    return [...paradas].sort((a, b) => (
      `${a.dataPreferencial || ''} ${a.janela || ''}`
        .localeCompare(`${b.dataPreferencial || ''} ${b.janela || ''}`)
    ));
  }

  function calcularRota() {
    setErro('');
    if (!paradasSelecionadas.length) {
      setErro('Selecione pelo menos uma coleta para montar a rota.');
      return;
    }
    if (paradasSelecionadas.length > 100) {
      setErro('Selecione no máximo 100 paradas por rota para calcular a sequência aproximada.');
      return;
    }

    const resultado = otimizarSequencia(ordenarPorData(paradasSelecionadas));
    setPlano(resultado);
    setAviso('Sequência aproximada por proximidade geográfica em linha reta; não considera ruas, trânsito nem janelas de horário.');
  }

  async function publicar() {
    if (!plano?.paradas?.length || !coletorUid) {
      setErro('Calcule a sequência e escolha um coletor antes de publicar.');
      return;
    }

    setErro('');
    setPublicando(true);
    try {
      await publicarRota(plano.paradas, coletorUid, session.user.uid);
      setSelecionadas([]);
      setColetorUid('');
      setPlano(null);
      setAviso('Rota publicada. Ela já está disponível para o coletor selecionado.');
    } catch (error) {
      console.error('Não foi possível publicar a rota:', error);
      setErro('Não foi possível publicar a rota. Atualize a página e tente novamente.');
    } finally {
      setPublicando(false);
    }
  }

  const volumeTotal = (plano?.paradas || []).reduce(
    (total, parada) => total + (Number(parada.volumeLitros) || 0),
    0
  );

  return (
    <main className="min-h-screen bg-bioclube-light px-4 py-6 text-bioclube-textMain sm:px-6 sm:py-9 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700">Central operacional</p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-bioclube-dark sm:text-3xl">Planejamento de rota</h1>
            <p className="mt-2 max-w-2xl text-sm text-bioclube-textSub">
              Escolha as solicitações com ponto e recipiente cadastrados, ordene as paradas e atribua a rota.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:min-w-64">
            <label htmlFor="coletor-rota" className="text-xs font-semibold">Coletor responsável</label>
            <select
              id="coletor-rota"
              value={coletorUid}
              onChange={(event) => setColetorUid(event.target.value)}
              className="rounded-lg border border-bioclube-border bg-white px-3 py-2.5 text-sm"
            >
              <option value="">Selecione um coletor</option>
              {coletores.map((coletor) => (
                <option key={coletor.id} value={coletor.id}>{coletor.nome || coletor.email || coletor.id}</option>
              ))}
            </select>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-bioclube-border bg-white p-5 shadow-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><Route className="h-5 w-5" /></span>
            <p className="mt-4 text-2xl font-extrabold">{plano?.paradas.length || 0}</p>
            <p className="mt-1 text-xs text-bioclube-textSub">paradas na sequência</p>
          </article>
          <article className="rounded-2xl border border-bioclube-border bg-white p-5 shadow-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><MapPin className="h-5 w-5" /></span>
            <p className="mt-4 text-2xl font-extrabold">{plano ? formatarDistancia(plano.distanciaMetros) : '—'}</p>
            <p className="mt-1 text-xs text-bioclube-textSub">distância aproximada em linha reta</p>
          </article>
          <article className="rounded-2xl border border-bioclube-border bg-white p-5 shadow-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Truck className="h-5 w-5" /></span>
            <p className="mt-4 text-2xl font-extrabold">{volumeTotal.toLocaleString('pt-BR')} L</p>
            <p className="mt-1 text-xs text-bioclube-textSub">volume estimado das paradas</p>
          </article>
        </section>

        {erro && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{erro}</p>}
        {aviso && <p role="status" className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">{aviso}</p>}

        <section className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <article className="rounded-2xl border border-bioclube-border bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold">Solicitações pendentes</h2>
                <p className="mt-1 text-xs text-bioclube-textSub">{elegiveis.length} com localização e recipiente</p>
              </div>
              <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                <button
                  type="button"
                  onClick={calcularRota}
                  disabled={carregando || !paradasSelecionadas.length}
                  className="flex-1 rounded-lg border border-bioclube-border px-3 py-2 text-xs font-bold text-bioclube-dark transition hover:bg-slate-50 disabled:opacity-50 sm:flex-none"
                >
                  Ordenar por proximidade
                </button>
                <button
                  type="button"
                  onClick={publicar}
                  disabled={!plano || !coletorUid || publicando}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-bioclube-dark px-3 py-2 text-xs font-bold text-white transition hover:bg-bioclube-secondary disabled:opacity-50 sm:flex-none"
                >
                  <Check className="h-4 w-4" />
                  {publicando ? 'Publicando…' : 'Publicar rota'}
                </button>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {carregando && <p className="py-8 text-center text-sm text-bioclube-textSub">Carregando solicitações…</p>}
              {!carregando && !elegiveis.length && (
                <p className="rounded-xl bg-slate-50 p-5 text-center text-sm text-bioclube-textSub">
                  Não há solicitações pendentes prontas para roteirização.
                </p>
              )}
              {elegiveis.map((parada) => (
                <label key={parada.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-bioclube-border p-4 transition hover:border-amber-400">
                  <input
                    type="checkbox"
                    checked={selecionadas.includes(parada.id)}
                    onChange={() => alternarParada(parada.id)}
                    className="mt-1 h-4 w-4 accent-amber-600"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center justify-between gap-2">
                      <strong className="truncate text-sm">{parada.solicitanteNome || 'Gerador'}</strong>
                      <span className="text-xs font-semibold text-bioclube-dark">{Number(parada.volumeLitros) || 0} L</span>
                    </span>
                    <span className="mt-1 block truncate text-xs text-bioclube-textSub">{parada.endereco}</span>
                    <span className="mt-1 block text-[11px] text-bioclube-textSub">
                      {parada.dataPreferencial || 'Data não informada'} · {parada.janela || 'Horário não informado'} · {parada.recipienteCodigo}
                    </span>
                  </span>
                </label>
              ))}
            </div>

            {(semLocalizacao.length > 0 || semRecipiente.length > 0) && (
              <div className="mt-4 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  {semLocalizacao.length > 0 && `${semLocalizacao.length} solicitação(ões) sem coordenadas; `}
                  {semRecipiente.length > 0 && `${semRecipiente.length} sem código de recipiente; `}
                  não entram na rota. Peça ao gerador para atualizar os dados.
                </p>
              </div>
            )}
          </article>

          <article className="space-y-4 rounded-2xl border border-bioclube-border bg-white p-5 shadow-sm sm:p-6">
            <div>
              <h2 className="text-base font-bold">Mapa e sequência</h2>
              <p className="mt-1 text-xs leading-5 text-bioclube-textSub">
                A ordem usa distância geográfica em linha reta. O traçado não segue ruas e não considera trânsito.
              </p>
            </div>
            <RouteMap paradas={plano?.paradas || paradasSelecionadas} geometria={plano?.geometria || []} className="h-72 sm:h-96" />
            <ol className="space-y-2">
              {(plano?.paradas || paradasSelecionadas).map((parada, index) => (
                <li key={parada.id} className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bioclube-dark text-xs font-bold text-white">{index + 1}</span>
                  <span className="min-w-0">
                    <strong className="block truncate text-xs">{parada.solicitanteNome || 'Gerador'}</strong>
                    <span className="mt-1 block truncate text-[11px] text-bioclube-textSub">{parada.endereco} · {parada.recipienteCodigo}</span>
                  </span>
                </li>
              ))}
            </ol>
          </article>
        </section>
      </div>
    </main>
  );
}
