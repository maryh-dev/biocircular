import React, { useEffect, useMemo, useState } from 'react';
import { Download, Droplet, FileText, Scale, Timer } from 'lucide-react';
import { observarTodasSolicitacoes } from '../../services/db.js';

function mesLocal(data) {
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
}

const MES_ATUAL = mesLocal(new Date());

function dataDaSolicitacao(item) {
  const valor = item.coletadaEm || item.updatedAt || item.createdAt;
  if (typeof valor?.toDate === 'function') return valor.toDate();
  if (valor instanceof Date) return valor;
  if (typeof valor === 'string' || typeof valor === 'number') {
    const data = new Date(valor);
    return Number.isNaN(data.getTime()) ? null : data;
  }
  return null;
}

function csvCampo(valor) {
  return `"${String(valor ?? '').replace(/"/g, '""')}"`;
}

export default function Indicadores() {
  const [lista, setLista] = useState(null);
  const [mes, setMes] = useState(MES_ATUAL);
  const [erro, setErro] = useState('');

  useEffect(() => observarTodasSolicitacoes(
    setLista,
    (error) => {
      console.error('Não foi possível carregar indicadores:', error);
      setErro('Não foi possível carregar os indicadores. Confira as regras do Firestore.');
    }
  ), []);

  const doMes = useMemo(() => (lista || []).filter((item) => {
    const data = dataDaSolicitacao(item);
    return data && `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}` === mes;
  }), [lista, mes]);
  const coletadas = doMes.filter((item) => ['coletada', 'concluida'].includes(item.status));
  const volume = coletadas.reduce((total, item) => total + (Number(item.volumeColetadoLitros) || 0), 0);
  const comEstimativa = coletadas.filter((item) => Number(item.volumeLitros) > 0);
  const divergencia = comEstimativa.length
    ? comEstimativa.reduce((total, item) => (
      total + Math.abs((Number(item.volumeColetadoLitros) || 0) - Number(item.volumeLitros))
        / Number(item.volumeLitros)
    ), 0) / comEstimativa.length * 100
    : 0;
  const concluidas = doMes.filter((item) => ['coletada', 'concluida'].includes(item.status)).length;
  const totalFinalizadas = doMes.filter((item) => ['coletada', 'concluida', 'cancelada'].includes(item.status)).length;
  const taxa = totalFinalizadas ? (concluidas / totalFinalizadas) * 100 : 0;

  function exportar() {
    if (!lista) return;
    const linhas = [
      ['ID', 'Gerador', 'Endereço', 'Recipiente', 'Status', 'Volume estimado (L)', 'Volume coletado (L)', 'Data'],
      ...doMes.map((item) => [
        item.id,
        item.solicitanteNome,
        item.endereco,
        item.recipienteCodigo,
        item.status,
        item.volumeLitros,
        item.volumeColetadoLitros,
        dataDaSolicitacao(item)?.toLocaleDateString('pt-BR'),
      ]),
    ];
    const csv = `\uFEFF${linhas.map((linha) => linha.map(csvCampo).join(';')).join('\r\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `biocircular-indicadores-${mes}.csv`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  const indicadores = [
    { icone: Droplet, valor: `${volume.toLocaleString('pt-BR')} L`, rotulo: 'Volume efetivamente coletado' },
    { icone: FileText, valor: lista === null ? '…' : `${taxa.toFixed(1)}%`, rotulo: 'Taxa de conclusão das finalizadas' },
    { icone: Timer, valor: coletadas.length, rotulo: 'Coletas registradas no período' },
    { icone: Scale, valor: `${divergencia.toFixed(2)}%`, rotulo: 'Divergência média da estimativa' },
  ];

  return (
    <main className="min-h-screen bg-bioclube-light px-4 py-6 text-bioclube-textMain sm:px-6 sm:py-9 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Central operacional</p>
            <h1 className="mt-2 text-2xl font-extrabold text-bioclube-dark">Indicadores</h1>
            <p className="mt-2 text-sm text-bioclube-textSub">Resumo calculado a partir das solicitações registradas.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="sr-only" htmlFor="mes-indicadores">Mês dos indicadores</label>
            <input id="mes-indicadores" type="month" value={mes} max={MES_ATUAL} onChange={(event) => setMes(event.target.value)} className="rounded-lg border border-bioclube-border bg-white px-3 py-2 text-sm" />
            <button type="button" onClick={exportar} disabled={lista === null} className="inline-flex items-center gap-2 rounded-lg bg-bioclube-dark px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
              <Download className="h-4 w-4" /> Exportar CSV
            </button>
          </div>
        </header>
        {erro && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{erro}</p>}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {indicadores.map(({ icone: Icon, valor, rotulo }) => (
            <article key={rotulo} className="rounded-2xl border border-bioclube-border bg-white p-5 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><Icon className="h-5 w-5" /></span>
              <p className="mt-5 text-2xl font-extrabold">{valor}</p>
              <p className="mt-1 text-xs text-bioclube-textSub">{rotulo}</p>
            </article>
          ))}
        </section>
        <section className="rounded-2xl border border-bioclube-border bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-bold">Solicitações incluídas</h2>
          {lista === null ? <p className="py-8 text-center text-sm text-bioclube-textSub">Carregando dados…</p>
            : doMes.length === 0 ? <p className="py-8 text-center text-sm text-bioclube-textSub">Nenhuma solicitação com atividade neste mês.</p>
              : (
                <>
                <div className="mt-4 space-y-3 lg:hidden">
                  {doMes.map((item) => (
                    <article key={item.id} className="space-y-3 rounded-xl border border-bioclube-border p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <strong className="break-words text-sm">{item.solicitanteNome || 'Gerador'}</strong>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold">{item.status}</span>
                      </div>
                      <dl className="grid grid-cols-2 gap-3 border-t border-bioclube-border pt-3 text-xs">
                        <div>
                          <dt className="text-bioclube-textSub">ESTIMADO</dt>
                          <dd className="mt-1 font-semibold">{Number(item.volumeLitros) || 0} L</dd>
                        </div>
                        <div>
                          <dt className="text-bioclube-textSub">COLETADO</dt>
                          <dd className="mt-1 font-semibold">{Number(item.volumeColetadoLitros) || 0} L</dd>
                        </div>
                        <div className="col-span-2">
                          <dt className="text-bioclube-textSub">DATA</dt>
                          <dd className="mt-1 font-semibold">{dataDaSolicitacao(item)?.toLocaleDateString('pt-BR') || '—'}</dd>
                        </div>
                      </dl>
                    </article>
                  ))}
                </div>

                <div className="mt-4 hidden overflow-x-auto lg:block">
                  <table className="w-full min-w-[680px] text-left text-xs">
                    <thead><tr className="border-b text-bioclube-textSub"><th className="pb-3">GERADOR</th><th className="pb-3">STATUS</th><th className="pb-3">ESTIMADO</th><th className="pb-3">COLETADO</th><th className="pb-3">DATA</th></tr></thead>
                    <tbody className="divide-y divide-bioclube-border">
                      {doMes.map((item) => (
                        <tr key={item.id}>
                          <td className="py-3">{item.solicitanteNome || 'Gerador'}</td>
                          <td className="py-3">{item.status}</td>
                          <td className="py-3">{Number(item.volumeLitros) || 0} L</td>
                          <td className="py-3">{Number(item.volumeColetadoLitros) || 0} L</td>
                          <td className="py-3">{dataDaSolicitacao(item)?.toLocaleDateString('pt-BR') || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                </>
              )}
        </section>
      </div>
    </main>
  );
}
