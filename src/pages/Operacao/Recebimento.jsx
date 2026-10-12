import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle, PackageCheck } from 'lucide-react';
import { observarLotes, registrarRecebimento } from '../../services/db.js';

export default function Recebimento({ session, onNavigate }) {
  const [lotes, setLotes] = useState(null);
  const [loteId, setLoteId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [resultado, setResultado] = useState('conforme');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');

  useEffect(() => observarLotes(
    setLotes,
    (error) => {
      console.error('Não foi possível carregar lotes para recebimento:', error);
      setErro('Não foi possível carregar os lotes. Confira as regras do Firestore.');
    }
  ), []);

  const aguardando = useMemo(
    () => (lotes || []).filter((lote) => lote.status === 'em_transporte'),
    [lotes]
  );
  const selecionado = aguardando.find((lote) => lote.id === loteId);

  useEffect(() => {
    if (loteId && !aguardando.some((lote) => lote.id === loteId)) {
      setLoteId('');
      setQuantidade('');
    }
  }, [loteId, aguardando]);

  async function enviar(event) {
    event.preventDefault();
    if (!loteId) {
      setErro('Selecione um lote aguardando recebimento.');
      return;
    }

    setErro('');
    setAviso('');
    setSalvando(true);
    try {
      await registrarRecebimento(session.user, {
        loteId,
        quantidadeLitros: quantidade,
        resultado,
        observacoes,
      });
      setLoteId('');
      setQuantidade('');
      setObservacoes('');
      setResultado('conforme');
      setAviso('Recebimento registrado; o lote foi atualizado.');
    } catch (error) {
      console.error('Não foi possível confirmar o recebimento:', error);
      setErro(error.message || 'Não foi possível registrar o recebimento.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main className="min-h-screen bg-bioclube-light px-4 py-6 text-bioclube-textMain sm:px-6 sm:py-9 lg:px-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Central operacional</p>
          <h1 className="mt-2 text-2xl font-extrabold text-bioclube-dark">Receber lote</h1>
          <p className="mt-2 text-sm text-bioclube-textSub">Confira o volume recebido e registre qualquer divergência.</p>
        </header>
        {erro && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{erro}</p>}
        {aviso && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{aviso}</p>}
        <form onSubmit={enviar} className="space-y-5 rounded-2xl border border-bioclube-border bg-white p-5 shadow-sm sm:p-7">
          {lotes === null ? (
            <p className="text-sm text-bioclube-textSub">Carregando lotes…</p>
          ) : aguardando.length === 0 ? (
            <div className="rounded-xl bg-slate-50 p-5 text-center">
              <PackageCheck className="mx-auto h-8 w-8 text-bioclube-textSub" />
              <p className="mt-3 text-sm font-semibold">Nenhum lote aguardando recebimento</p>
              <button type="button" onClick={() => onNavigate?.('op-lotes')} className="mt-3 text-sm font-bold text-amber-800 underline">Ver lotes</button>
            </div>
          ) : (
            <>
              <div>
                <label htmlFor="lote-recebimento" className="mb-2 block text-sm font-semibold">Lote a receber</label>
                <select id="lote-recebimento" required value={loteId} onChange={(event) => {
                  const id = event.target.value;
                  setLoteId(id);
                  const lote = aguardando.find((item) => item.id === id);
                  setQuantidade(lote ? String(lote.volumeLitros || '') : '');
                }} className="w-full rounded-lg border border-bioclube-border bg-white px-3 py-3 text-sm">
                  <option value="">Selecione um lote</option>
                  {aguardando.map((lote) => <option key={lote.id} value={lote.id}>{lote.codigo || lote.id} · {Number(lote.volumeLitros) || 0} L declarados</option>)}
                </select>
              </div>
              {selecionado && (
                <div className="grid gap-3 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-3">
                  <div><span className="block text-xs text-bioclube-textSub">COLETAS</span><strong>{Number(selecionado.quantidadeColetas) || selecionado.solicitacaoIds?.length || 0}</strong></div>
                  <div><span className="block text-xs text-bioclube-textSub">VOLUME DECLARADO</span><strong>{Number(selecionado.volumeLitros) || 0} L</strong></div>
                  <div><span className="block text-xs text-bioclube-textSub">STATUS</span><strong>{selecionado.status}</strong></div>
                </div>
              )}
              <div>
                <label htmlFor="quantidade-recebida" className="mb-2 block text-sm font-semibold">Quantidade física recebida (litros)</label>
                <input id="quantidade-recebida" type="number" min="0.01" step="0.01" required value={quantidade} onChange={(event) => setQuantidade(event.target.value)} className="w-full rounded-lg border border-bioclube-border px-3 py-3 text-sm" />
              </div>
              <div>
                <label htmlFor="resultado-recebimento" className="mb-2 block text-sm font-semibold">Conferência</label>
                <select id="resultado-recebimento" value={resultado} onChange={(event) => setResultado(event.target.value)} className="w-full rounded-lg border border-bioclube-border bg-white px-3 py-3 text-sm">
                  <option value="conforme">Conforme</option>
                  <option value="divergente">Com divergência</option>
                </select>
              </div>
              <div>
                <label htmlFor="observacoes-recebimento" className="mb-2 block text-sm font-semibold">Observações</label>
                <textarea id="observacoes-recebimento" rows="3" value={observacoes} onChange={(event) => setObservacoes(event.target.value)} className="w-full rounded-lg border border-bioclube-border px-3 py-3 text-sm" placeholder="Opcional" />
              </div>
              {resultado === 'divergente' && (
                <p className="flex gap-2 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-900"><AlertTriangle className="h-4 w-4 shrink-0" />Registre a diferença de volume ou outra ocorrência nas observações.</p>
              )}
              <button type="submit" disabled={salvando} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-bioclube-dark px-4 py-3 text-sm font-bold text-white disabled:opacity-60">
                <CheckCircle className="h-4 w-4" />{salvando ? 'Salvando recebimento…' : 'Confirmar recebimento'}
              </button>
            </>
          )}
        </form>
      </div>
    </main>
  );
}
