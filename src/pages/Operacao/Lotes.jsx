import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Check, PackagePlus } from 'lucide-react';
import { criarLote, observarLotes, observarTodasSolicitacoes } from '../../services/db.js';

export default function Lotes({ session, onNavigate }) {
  const [lotes, setLotes] = useState(null);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [selecionadas, setSelecionadas] = useState([]);
  const [criando, setCriando] = useState(false);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');

  useEffect(() => {
    const cancelarLotes = observarLotes(
      setLotes,
      (error) => {
        console.error('Não foi possível carregar lotes:', error);
        setErro('Não foi possível carregar lotes. Confira as regras do Firestore.');
      }
    );
    const cancelarSolicitacoes = observarTodasSolicitacoes(
      setSolicitacoes,
      (error) => {
        console.error('Não foi possível carregar coletas concluídas:', error);
        setErro('Não foi possível carregar coletas concluídas.');
      }
    );
    return () => {
      cancelarLotes();
      cancelarSolicitacoes();
    };
  }, []);

  const disponiveis = useMemo(
    () => solicitacoes.filter((item) => item.status === 'coletada' && !item.loteId),
    [solicitacoes]
  );
  const totalEmTransporte = (lotes || []).filter((lote) => lote.status === 'em_transporte').length;
  const volumeEmTransporte = (lotes || [])
    .filter((lote) => lote.status === 'em_transporte')
    .reduce((total, lote) => total + (Number(lote.volumeLitros) || 0), 0);

  function alternar(id) {
    setSelecionadas((atual) => atual.includes(id)
      ? atual.filter((item) => item !== id)
      : [...atual, id]);
  }

  async function criar() {
    const coletas = disponiveis.filter((item) => selecionadas.includes(item.id));
    if (!coletas.length) {
      setErro('Selecione pelo menos uma coleta concluída.');
      return;
    }
    setErro('');
    setAviso('');
    setCriando(true);
    try {
      const lote = await criarLote(session.user, coletas);
      setSelecionadas([]);
      setAviso(`Lote ${lote.codigo} criado e vinculado às coletas selecionadas.`);
    } catch (error) {
      console.error('Não foi possível criar lote:', error);
      setErro(error.message || 'Não foi possível criar o lote. Verifique as permissões e tente novamente.');
    } finally {
      setCriando(false);
    }
  }

  return (
    <main className="min-h-screen bg-bioclube-light px-4 py-6 text-bioclube-textMain sm:px-6 sm:py-9 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Central operacional</p>
            <h1 className="mt-2 text-2xl font-extrabold text-bioclube-dark">Lotes</h1>
            <p className="mt-2 text-sm text-bioclube-textSub">Agrupe coletas concluídas para transporte e rastreie recebimento e destinação.</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate?.('op-recebimento')}
            className="rounded-lg border border-bioclube-border bg-white px-4 py-2.5 text-sm font-bold"
          >
            Ir para recebimentos
          </button>
        </header>

        {erro && <p role="alert" className="flex gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"><AlertCircle className="h-4 w-4 shrink-0" />{erro}</p>}
        {aviso && <p role="status" className="flex gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><Check className="h-4 w-4 shrink-0" />{aviso}</p>}

        <section className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-xl border border-bioclube-border bg-white p-5"><strong className="text-2xl">{totalEmTransporte}</strong><p className="mt-1 text-xs text-bioclube-textSub">Lotes em transporte</p></article>
          <article className="rounded-xl border border-bioclube-border bg-white p-5"><strong className="text-2xl">{volumeEmTransporte.toLocaleString('pt-BR')} L</strong><p className="mt-1 text-xs text-bioclube-textSub">Volume em transporte</p></article>
          <article className="rounded-xl border border-bioclube-border bg-white p-5"><strong className="text-2xl">{disponiveis.length}</strong><p className="mt-1 text-xs text-bioclube-textSub">Coletas sem lote</p></article>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-bioclube-border bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-bold">Criar lote de transporte</h2>
                <p className="mt-1 text-xs text-bioclube-textSub">Selecione coletas marcadas como coletadas.</p>
              </div>
              <button type="button" onClick={criar} disabled={criando || selecionadas.length === 0} className="inline-flex items-center gap-2 rounded-lg bg-bioclube-dark px-3 py-2 text-xs font-bold text-white disabled:opacity-50">
                <PackagePlus className="h-4 w-4" />{criando ? 'Criando…' : 'Criar lote'}
              </button>
            </div>
            <div className="mt-4 max-h-96 space-y-2 overflow-y-auto">
              {disponiveis.length === 0 && <p className="rounded-lg bg-slate-50 p-4 text-sm text-bioclube-textSub">Não há coletas concluídas disponíveis para agrupar.</p>}
              {disponiveis.map((item) => (
                <label key={item.id} className="flex cursor-pointer items-start gap-3 rounded-lg border border-bioclube-border p-3 hover:border-amber-400">
                  <input type="checkbox" checked={selecionadas.includes(item.id)} onChange={() => alternar(item.id)} className="mt-1 accent-amber-600" />
                  <span className="min-w-0 flex-1">
                    <strong className="block truncate text-sm">{item.solicitanteNome || 'Gerador'} · {item.endereco}</strong>
                    <span className="mt-1 block text-xs text-bioclube-textSub">{item.recipienteCodigo} · {Number(item.volumeColetadoLitros) || 0} L coletados</span>
                  </span>
                </label>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-bioclube-border bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-bold">Lotes registrados</h2>
            <div className="mt-4 space-y-3">
              {lotes === null && <p className="py-6 text-center text-sm text-bioclube-textSub">Carregando lotes…</p>}
              {lotes?.length === 0 && <p className="rounded-lg bg-slate-50 p-4 text-sm text-bioclube-textSub">Nenhum lote registrado.</p>}
              {lotes?.map((lote) => (
                <article key={lote.id} className="rounded-xl border border-bioclube-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong className="font-mono text-sm">{lote.codigo || lote.id}</strong>
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-800">{lote.status || 'Sem status'}</span>
                  </div>
                  <p className="mt-2 text-xs text-bioclube-textSub">
                    {Number(lote.quantidadeColetas) || lote.solicitacaoIds?.length || 0} coletas · {Number(lote.volumeLitros) || 0} L
                  </p>
                  {lote.status === 'em_transporte' && (
                    <button type="button" onClick={() => onNavigate?.('op-recebimento')} className="mt-3 text-xs font-bold text-amber-800 underline">
                      Registrar recebimento
                    </button>
                  )}
                  {lote.status === 'recebido' && (
                    <button type="button" onClick={() => onNavigate?.('destino-reg')} className="mt-3 text-xs font-bold text-amber-800 underline">
                      Registrar destinação
                    </button>
                  )}
                </article>
              ))}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
