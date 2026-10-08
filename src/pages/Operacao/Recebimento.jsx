import React from 'react';
import { Bell, Search, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from '../../components/NavigationContext';

export default function Recebimento() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans text-[#17202A]">
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-[#D9E0E7] px-4 md:px-8 flex items-center justify-between">
          <span className="text-xs text-[#667085]">BIOCIRCULAR / <strong className="text-[#17202A]">Recebimentos</strong></span>
          <div className="flex items-center gap-4">
            <Search className="w-4 h-4 text-gray-400 cursor-pointer" />
            <Bell className="w-4 h-4 text-gray-400 cursor-pointer" />
          </div>
        </header>

        <div className="p-4 md:p-8 space-y-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Receber lote</h1>
            <p className="text-xs text-[#667085] mt-1">Confira identificação, transporte e quantidade física recebida.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#D9E0E7] shadow-sm space-y-6 max-w-2xl">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#0B1726]">LOT-2026-00142</h3>
                <p className="text-xs text-[#667085]">Rota SP-08 · Veículo ABC-4D28</p>
              </div>
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">Em transporte</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg text-xs">
              <div><span className="text-[#667085] block">QUANTIDADE DECLARADA</span><strong className="text-sm">1.240 L</strong></div>
              <div><span className="text-[#667085] block">COLETAS</span><strong className="text-sm">4 recipientes</strong></div>
              <div><span className="text-[#667085] block">MOTORISTA</span><strong className="text-sm">Carlos Almeida</strong></div>
            </div>

            <button type="button" onClick={() => navigate('destino-reg')} className="w-full py-3 bg-[#0B1726] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#16324F]">
              <CheckCircle className="w-4 h-4" /> Confirmar recebimento
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}