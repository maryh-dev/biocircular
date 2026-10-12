import React, { useEffect, useState } from 'react';
import { Search, Bell, Plus } from 'lucide-react';
import { observarMinhasSolicitacoes } from '../../services/db.js';
import StatusBadge, { formatarData } from '../../components/StatusBadge.jsx';

export default function MinhasSolicitacoes({ session, onNavigate }) {
  const [lista, setLista] = useState(null);
  const [erro, setErro] = useState(null);
  const [filtro, setFiltro] = useState('todas');
  const nome = session?.profile?.nome || 'Gerador';
  const sigla = nome.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

  useEffect(() => observarMinhasSolicitacoes(session.user.uid, setLista, () => setErro('Não foi possível carregar suas solicitações. Confira se as regras do Firestore foram publicadas.')), [session.user.uid]);

  const emAndamento = (lista || []).filter((s) => ['solicitada', 'agendada', 'em_rota', 'coletada'].includes(s.status));
  const concluidas = (lista || []).filter((s) => s.status === 'concluida');
  const visiveis = filtro === 'andamento' ? emAndamento : filtro === 'concluidas' ? concluidas : (lista || []);
  const aba = (id, rotulo, n) => (
    <button type="button" onClick={() => setFiltro(id)} className={`px-3 py-1.5 rounded-md ${filtro === id ? 'bg-white border shadow-sm' : 'text-gray-500'}`}>
      {rotulo} <span className="bg-gray-100 px-1.5 rounded ml-1 text-gray-500">{n}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-bioclube-light font-sans text-bioclube-textMain">
      <div className="p-4 md:p-8 space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Minhas solicitações</h1>
              <p className="text-xs text-bioclube-textSub mt-1">Consulte status e volumes das suas coletas.</p>
            </div>
            <button type="button" onClick={() => onNavigate?.('gerador-solicitar')} className="flex w-full items-center justify-center gap-2 rounded-lg bg-bioclube-dark px-4 py-2.5 text-xs font-bold text-white sm:w-auto"><Plus className="w-4 h-4" /> Nova solicitação</button>
          </div>

          <div className="flex flex-wrap gap-2 border-b border-bioclube-border pb-3 text-xs font-bold">
            {aba('todas', 'Todas', (lista || []).length)}
            {aba('andamento', 'Em andamento', emAndamento.length)}
            {aba('concluidas', 'Concluídas', concluidas.length)}
          </div>

          {erro && <p role="alert" className="text-sm rounded-md p-3 bg-red-50 text-red-700">{erro}</p>}

          <div className="bg-white rounded-xl border border-bioclube-border shadow-sm p-4 md:p-6">
            <div className="space-y-3 lg:hidden">
              {lista === null && !erro && <p className="py-6 text-center text-sm text-gray-500">Carregando…</p>}
              {lista !== null && visiveis.length === 0 && <p className="py-6 text-center text-sm text-gray-500">Nenhuma solicitação ainda. Clique em “Nova solicitação”.</p>}
              {visiveis.map((solicitacao) => (
                <article key={solicitacao.id} className="space-y-3 rounded-xl border border-bioclube-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong className="font-mono text-sm">SOL-{solicitacao.id.slice(0, 6).toUpperCase()}</strong>
                    <StatusBadge status={solicitacao.status} />
                  </div>
                  <p className="break-words text-sm leading-5 text-bioclube-textMain">{solicitacao.endereco || 'Endereço não informado'}</p>
                  <dl className="grid grid-cols-2 gap-3 border-t border-bioclube-border pt-3 text-xs">
                    <div>
                      <dt className="text-bioclube-textSub">VOLUME</dt>
                      <dd className="mt-1 font-semibold">{solicitacao.volumeLitros} L</dd>
                    </div>
                    <div>
                      <dt className="text-bioclube-textSub">DATA</dt>
                      <dd className="mt-1 font-semibold">{formatarData(solicitacao.dataPreferencial)}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>

            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-[640px] w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-bioclube-textSub">
                    <th className="pb-3">IDENTIFICAÇÃO</th>
                    <th className="pb-3">ENDEREÇO</th>
                    <th className="pb-3">VOLUME</th>
                    <th className="pb-3">DATA</th>
                    <th className="pb-3">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bioclube-border">
                  {lista === null && !erro && <tr><td colSpan="5" className="py-6 text-center text-gray-500">Carregando…</td></tr>}
                  {lista !== null && visiveis.length === 0 && <tr><td colSpan="5" className="py-6 text-center text-gray-500">Nenhuma solicitação ainda. Clique em “Nova solicitação”.</td></tr>}
                  {visiveis.map((s) => (
                    <tr key={s.id}>
                      <td className="py-4 font-bold">SOL-{s.id.slice(0, 6).toUpperCase()}</td>
                      <td className="py-4">{s.endereco}</td>
                      <td className="py-4">{s.volumeLitros} L</td>
                      <td className="py-4">{formatarData(s.dataPreferencial)} · {s.janela?.split('–')[0]}</td>
                      <td className="py-4"><StatusBadge status={s.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
    </div>
  );
}
