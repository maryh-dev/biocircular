import React from 'react';
import { Search, Bell, ArrowLeft } from 'lucide-react';
import { useNavigate } from '../../components/NavigationContext';

export default function DetalhesSolicitacao() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-bioclube-light font-sans text-bioclube-textMain">
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-bioclube-border px-4 md:px-8 flex items-center justify-between">
          <span className="text-xs text-bioclube-textSub">BIOCIRCULAR / <strong className="text-bioclube-textMain">Solicitações</strong></span>
          <div className="flex items-center gap-4"><Search className="w-4 h-4 text-gray-400" /><Bell className="w-4 h-4 text-gray-400" /></div>
        </header>

        <div className="p-4 md:p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">SOL-2026-00984</h1>
              <p className="text-xs text-bioclube-textSub mt-1">Criada em 26/09/2026 às 16:42 por Bistrô da Serra</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => navigate('op-solicitacoes')} className="px-4 py-2 border border-bioclube-border rounded-lg text-xs font-bold">Voltar às solicitações</button>
              <button type="button" onClick={() => navigate('op-agendamento')} className="px-4 py-2 bg-bioclube-dark text-white rounded-lg text-xs font-bold">Agendar coleta</button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-bioclube-border shadow-sm space-y-4">
                <h3 className="font-bold text-sm">Dados da solicitação</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div><span className="text-bioclube-textSub block">GERADOR</span><strong>Bistrô da Serra — Pinheiros</strong></div>
                  <div><span className="text-bioclube-textSub block">RECIPIENTE</span><strong>REC-00482</strong></div>
                  <div><span className="text-bioclube-textSub block">VOLUME ESTIMADO</span><strong>180 L</strong></div>
                  <div><span className="text-bioclube-textSub block">DATA</span><strong>27/09/2026</strong></div>
                  <div><span className="text-bioclube-textSub block">JANELA</span><strong>10:00–11:00</strong></div>
                  <div><span className="text-bioclube-textSub block">COLETOR</span><strong>Carlos Almeida</strong></div>
                </div>
              </div>
            </div>

            {/* Timeline Lateral (Rastreabilidade) */}
            <div className="bg-white p-6 rounded-xl border border-bioclube-border shadow-sm">
              <h3 className="font-bold text-sm mb-4">Rastreabilidade</h3>
              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-green-600"></span> Solicitação criada</div>
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-green-600"></span> Coleta agendada</div>
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span> Coletor atribuído</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}