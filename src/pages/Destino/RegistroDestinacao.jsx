import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { observarLotes, registrarDestinacao } from '../../services/db.js';

export default function RegistroDestinacao({ session, onNavigate }) {
  const [lotes, setLotes] = useState(null);
  const [loteId, setLoteId] = useState('');
  const [destinatario, setDestinatario] = useState('');
  const [tipoDestino, setTipoDestino] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');

  useEffect(() => observarLotes(
    setLotes,
    (error) => {
      console.error('Não foi possível carregar lotes para destinação:', error);
      setErro('Não foi possível carregar lotes. Confira as regras do Firestore.');
    }
  ), []);

  const recebidos = useMemo(
    () => (lotes || []).filter((lote) => lote.status === 'recebido'),
    [lotes]
  );
  const selecionado = recebidos.find((lote) => lote.id === loteId);

  useEffect(() => {
    if (loteId && !recebidos.some((lote) => lote.id === loteId)) {
      setLoteId('');
      setQuantidade('');
    }
  }, [loteId, recebidos]);

  async function enviar(event) {
    event.preventDefault();
    if (!loteId) {
      setErro('Selecione um lote recebido antes de registrar a destinação.');
      return;
    }

    setErro('');
    setAviso('');
    setSalvando(true);
    try {
      await registrarDestinacao(session.user, {
        loteId,
        destinatario,
        tipoDestino,
        quantidadeLitros: quantidade,
        observacoes,
      });
      setLoteId('');
      setQuantidade('');
      setObservacoes('');
      setAviso('Destinação registrada; o ciclo do lote foi atualizado.');
    } catch (error) {
      console.error('Não foi possível registrar a destinação:', error);
      setErro(error.message || 'Não foi possível registrar a destinação.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main className="min-h-screen bg-bioclube-light px-4 py-6 text-bioclube-textMain sm:px-6 sm:py-9 lg:px-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Rastreabilidade</p>
          <h1 className="mt-2 text-2xl font-extrabold text-bioclube-dark">Registrar destinação</h1>
          <p className="mt-2 text-sm text-bioclube-textSub">Registre o destino final de um lote recebido.</p>
        </header>
        {erro && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{erro}</p>}
        {aviso && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{aviso}</p>}
        <form onSubmit={enviar} className="space-y-5 rounded-2xl border border-bioclube-border bg-white p-5 shadow-sm sm:p-7">
          {lotes === null ? (
            <p className="text-sm text-bioclube-textSub">Carregando lotes…</p>
          ) : recebidos.length === 0 ? (
            <div className="rounded-xl bg-slate-50 p-5 text-center">
              <p className="text-sm font-semibold">Nenhum lote recebido aguardando destinação</p>
              <p className="mt-2 text-xs text-bioclube-textSub">A operação precisa registrar o recebimento antes desta etapa.</p>
            </div>
          ) : (
            <>
              <div>
                <label htmlFor="lote-destinacao" className="mb-2 block text-sm font-semibold">Lote recebido</label>
                <select id="lote-destinacao" required value={loteId} onChange={(event) => {
                  const id = event.target.value;
                  setLoteId(id);
                  const lote = recebidos.find((item) => item.id === id);
                  setQuantidade(lote ? String(lote.quantidadeRecebidaLitros || lote.volumeLitros || '') : '');
                }} className="w-full rounded-lg border border-bioclube-border bg-white px-3 py-3 text-sm">
                  <option value="">Selecione um lote</option>
                  {recebidos.map((lote) => <option key={lote.id} value={lote.id}>{lote.codigo || lote.id} · {Number(lote.quantidadeRecebidaLitros || lote.volumeLitros) || 0} L recebidos</option>)}
                </select>
              </div>
              {selecionado && (
                <div className="rounded-xl bg-slate-50 p-4 text-sm">
                  <span className="block text-xs text-bioclube-textSub">VOLUME RECEBIDO</span>
                  <strong>{Number(selecionado.quantidadeRecebidaLitros || selecionado.volumeLitros) || 0} L</strong>
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="destinatario" className="mb-2 block text-sm font-semibold">Destino / unidade</label>
                  <input id="destinatario" required value={destinatario} onChange={(event) => setDestinatario(event.target.value)} placeholder="Ex.: Unidade Osasco" className="w-full rounded-lg border border-bioclube-border px-3 py-3 text-sm" />
                </div>
                <div>
                  <label htmlFor="tipo-destino" className="mb-2 block text-sm font-semibold">Tipo de destinação</label>
                  <input id="tipo-destino" required value={tipoDestino} onChange={(event) => setTipoDestino(event.target.value)} placeholder="Ex.: Insumo industrial" className="w-full rounded-lg border border-bioclube-border px-3 py-3 text-sm" />
                </div>
              </div>
              <div>
                <label htmlFor="quantidade-destinada" className="mb-2 block text-sm font-semibold">Quantidade destinada (litros)</label>
                <input id="quantidade-destinada" type="number" min="0.01" step="0.01" max={selecionado?.quantidadeRecebidaLitros || selecionado?.volumeLitros || undefined} required value={quantidade} onChange={(event) => setQuantidade(event.target.value)} className="w-full rounded-lg border border-bioclube-border px-3 py-3 text-sm" />
              </div>
              <div>
                <label htmlFor="observacoes-destinacao" className="mb-2 block text-sm font-semibold">Observações</label>
                <textarea id="observacoes-destinacao" rows="3" value={observacoes} onChange={(event) => setObservacoes(event.target.value)} placeholder="Opcional" className="w-full rounded-lg border border-bioclube-border px-3 py-3 text-sm" />
              </div>
              <p className="flex gap-2 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-900"><AlertTriangle className="h-4 w-4 shrink-0" />Confirmar encerra o ciclo do lote. Confira destino e quantidade antes de salvar.</p>
              <button type="submit" disabled={salvando} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-bioclube-dark px-4 py-3 text-sm font-bold text-white disabled:opacity-60">
                <CheckCircle2 className="h-4 w-4" />{salvando ? 'Salvando destinação…' : 'Confirmar destinação'}
              </button>
            </>
          )}
        </form>
      </div>
    </main>
  );
}
