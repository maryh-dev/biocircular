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
            <div className="text-[10px] text-gray-400">Gerador</div>
          </div>
          <nav className="space-y-1">
            <button type="button" onClick={() => onNavigate?.('gerador-dash')} className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white text-sm font-medium">Dashboard</button>
            <button type="button" className="flex items-center gap-3 px-3 py-2.5 bg-bioclube-secondary rounded-md text-sm font-medium border-l-4 border-bioclube-amber">Solicitações</button>
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-bioclube-border px-4 md:px-8 flex items-center justify-between">
          <span className="text-xs text-bioclube-textSub">BIOCIRCULAR / <strong className="text-bioclube-textMain">Solicitações</strong></span>
          <div className="flex items-center gap-4"><Search className="w-4 h-4 text-gray-400" /><Bell className="w-4 h-4 text-gray-400" /></div>
        </header>

        <div className="p-4 md:p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Minhas solicitações</h1>
              <p className="text-xs text-bioclube-textSub mt-1">Consulte status e volumes das suas coletas.</p>
            </div>
            <button type="button" onClick={() => onNavigate?.('gerador-solicitar')} className="flex items-center gap-2 bg-bioclube-dark text-white px-4 py-2.5 rounded-lg text-xs font-bold"><Plus className="w-4 h-4" /> Nova solicitação</button>
          </div>

          <div className="flex gap-2 border-b border-bioclube-border pb-3 text-xs font-bold">
            {aba('todas', 'Todas', (lista || []).length)}
            {aba('andamento', 'Em andamento', emAndamento.length)}
            {aba('concluidas', 'Concluídas', concluidas.length)}
          </div>

          {erro && <p role="alert" className="text-sm rounded-md p-3 bg-red-50 text-red-700">{erro}</p>}

          <div className="bg-white rounded-xl border border-bioclube-border shadow-sm p-4 md:p-6">
            <div className="overflow-x-auto">
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
      </main>
    </div>
  );
}
