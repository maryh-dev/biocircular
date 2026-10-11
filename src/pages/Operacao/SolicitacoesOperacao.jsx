import React, { useEffect, useState } from 'react';
import { Search, Bell, FileText, Calendar, GitPullRequest, AlertCircle } from 'lucide-react';
import { observarTodasSolicitacoes, mudarStatusSolicitacao, STATUS_SOLICITACAO, TRANSICOES_SOLICITACAO } from '../../services/db.js';
import StatusBadge, { formatarData } from '../../components/StatusBadge.jsx';

export default function SolicitacoesOperacao({ session }) {
  const [lista, setLista] = useState(null);
  const [erro, setErro] = useState(null);
  const nome = session?.profile?.nome || 'Operação';
  const sigla = nome.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

  useEffect(() => observarTodasSolicitacoes(setLista, () => setErro('Não foi possível carregar as solicitações. Confira se as regras do Firestore foram publicadas.')), []);

  const conta = (status) => (lista || []).filter((s) => s.status === status).length;

  async function trocarStatus(solicitacao, novoStatus) {
    setErro(null);
    try {
      await mudarStatusSolicitacao(session.user, solicitacao, novoStatus);
    } catch (e) {
      console.error(e);
      setErro(e?.message || 'Não foi possível atualizar o status.');
    }
  }

  const opcoesStatus = (status) => (TRANSICOES_SOLICITACAO[status] || [status]).filter((valor) => valor !== status);

  return (
    <div className="flex min-h-screen bg-bioclube-light font-sans text-bioclube-textMain">
      <aside className="hidden lg:flex lg:w-64 flex-shrink-0 bg-bioclube-dark text-white flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-2 mb-10">
            <span className="bg-bioclube-amber text-bioclube-dark font-bold px-2 py-0.5 rounded text-xs">BC</span>
            <span className="font-bold tracking-wider text-sm">BIOCIRCULAR</span>
          </div>
          <div className="bg-bioclube-secondary p-3 rounded-lg mb-6 border border-gray-800">
            <div className="text-xs font-bold text-bioclube-amber">{sigla}</div>
            <div className="text-sm font-bold">{nome}</div>
            <div className="text-[10px] text-gray-400">Operação</div>
          </div>
          <nav className="space-y-1">
            <span aria-current="page" className="flex items-center gap-3 px-3 py-2.5 bg-bioclube-secondary rounded-md text-sm font-medium border-l-4 border-bioclube-amber">Solicitações</span>
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-bioclube-border px-4 md:px-8 flex items-center justify-between">
          <span className="text-xs text-bioclube-textSub">BIOCIRCULAR / <strong className="text-bioclube-textMain">Solicitações</strong></span>
          <div className="flex items-center gap-4"><Search className="w-4 h-4 text-gray-400" /><Bell className="w-4 h-4 text-gray-400" /></div>
        </header>

        <div className="p-4 md:p-8 space-y-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Solicitações</h1>
            <p className="text-xs text-bioclube-textSub mt-1">Gerencie triagem, agendamento e atribuição de coletas.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-bioclube-border shadow-sm">
              <FileText className="w-4 h-4 text-blue-600 mb-2" />
              <div className="text-2xl font-extrabold">{conta('solicitada')}</div>
              <div className="text-[11px] text-bioclube-textSub mt-1">Solicitadas</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-bioclube-border shadow-sm">
              <Calendar className="w-4 h-4 text-blue-600 mb-2" />
              <div className="text-2xl font-extrabold">{conta('agendada')}</div>
              <div className="text-[11px] text-bioclube-textSub mt-1">Agendadas</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-bioclube-border shadow-sm">
              <GitPullRequest className="w-4 h-4 text-blue-600 mb-2" />
              <div className="text-2xl font-extrabold">{conta('em_rota')}</div>
              <div className="text-[11px] text-bioclube-textSub mt-1">Em rota</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-bioclube-border shadow-sm">
              <AlertCircle className="w-4 h-4 text-amber-600 mb-2" />
              <div className="text-2xl font-extrabold">{conta('cancelada')}</div>
              <div className="text-[11px] text-bioclube-textSub mt-1">Canceladas</div>
            </div>
          </div>

          {erro && <p role="alert" className="text-sm rounded-md p-3 bg-red-50 text-red-700">{erro}</p>}

          <div className="bg-white rounded-xl border border-bioclube-border shadow-sm p-4 md:p-6">
            <div className="space-y-3 xl:hidden">
              {lista === null && !erro && <p className="py-6 text-center text-sm text-gray-500">Carregando…</p>}
              {lista !== null && lista.length === 0 && <p className="py-6 text-center text-sm text-gray-500">Nenhuma solicitação cadastrada ainda.</p>}
              {(lista || []).map((solicitacao) => (
                <article key={solicitacao.id} className="space-y-3 rounded-xl border border-bioclube-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong className="font-mono text-sm">SOL-{solicitacao.id.slice(0, 6).toUpperCase()}</strong>
                    <StatusBadge status={solicitacao.status} />
                  </div>
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold">{solicitacao.solicitanteNome || 'Gerador'}</p>
                    <p className="mt-1 break-words text-xs text-bioclube-textSub">{solicitacao.endereco}</p>
                  </div>
                  <dl className="grid grid-cols-2 gap-3 border-t border-bioclube-border pt-3 text-xs">
                    <div>
                      <dt className="text-bioclube-textSub">VOLUME</dt>
                      <dd className="mt-1 font-semibold">{solicitacao.volumeLitros} L</dd>
                    </div>
                    <div>
                      <dt className="text-bioclube-textSub">DATA</dt>
                      <dd className="mt-1 font-semibold">{formatarData(solicitacao.dataPreferencial)} · {solicitacao.janela?.split('–')[0]}</dd>
                    </div>
                  </dl>
                  <label className="block text-xs font-semibold">
                    Alterar status
                    <select
                      value={solicitacao.status}
                      disabled={!opcoesStatus(solicitacao.status).length}
                      onChange={(event) => trocarStatus(solicitacao, event.target.value)}
                      aria-label={`Status de ${solicitacao.id}`}
                      className="mt-1.5 w-full rounded-lg border border-bioclube-border bg-white px-3 py-2.5 text-sm disabled:cursor-not-allowed disabled:bg-slate-100"
                    >
                      <option value={solicitacao.status}>{STATUS_SOLICITACAO[solicitacao.status] || solicitacao.status}</option>
                      {opcoesStatus(solicitacao.status).map((valor) => (
                        <option key={valor} value={valor}>{STATUS_SOLICITACAO[valor] || valor}</option>
                      ))}
                    </select>
                  </label>
                </article>
              ))}
            </div>

            <div className="hidden overflow-x-auto xl:block">
              <table className="min-w-[760px] w-full text-left text-xs">
              <thead>
                <tr className="border-b text-bioclube-textSub pb-2">
                  <th className="pb-3">IDENTIFICAÇÃO</th>
                  <th className="pb-3">ORIGEM / GERADOR</th>
                  <th className="pb-3">QUANTIDADE</th>
                  <th className="pb-3">DATA</th>
                  <th className="pb-3">STATUS</th>
                  <th className="pb-3 text-right">ALTERAR STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bioclube-border">
                {lista === null && !erro && <tr><td colSpan="6" className="py-6 text-center text-gray-500">Carregando…</td></tr>}
                {lista !== null && lista.length === 0 && <tr><td colSpan="6" className="py-6 text-center text-gray-500">Nenhuma solicitação cadastrada ainda.</td></tr>}
                {(lista || []).map((s) => (
                  <tr key={s.id}>
                    <td className="py-4 font-bold">SOL-{s.id.slice(0, 6).toUpperCase()}</td>
                    <td className="py-4">{s.solicitanteNome}<div className="text-[10px] text-gray-500">{s.endereco}</div></td>
                    <td className="py-4">{s.volumeLitros} L</td>
                    <td className="py-4">{formatarData(s.dataPreferencial)} · {s.janela?.split('–')[0]}</td>
                    <td className="py-4"><StatusBadge status={s.status} /></td>
                    <td className="py-4 text-right">
                      <select
                        value={s.status}
                        disabled={!opcoesStatus(s.status).length}
                        onChange={(e) => trocarStatus(s, e.target.value)}
                        aria-label={`Status de ${s.id}`}
                        className="border border-bioclube-border rounded-md p-1.5 text-xs bg-white disabled:cursor-not-allowed disabled:bg-slate-100"
                      >
                        <option value={s.status}>{STATUS_SOLICITACAO[s.status] || s.status}</option>
                        {opcoesStatus(s.status).map((valor) => (
                          <option key={valor} value={valor}>{STATUS_SOLICITACAO[valor] || valor}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}