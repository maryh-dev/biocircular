import React from 'react';
import { ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function RegistrarQuantidade() {
  return (
    <div className="flex justify-center bg-gray-900 min-h-screen py-6">
      <div className="w-[375px] bg-[#F5F7FA] text-[#17202A] min-h-[812px] rounded-[40px] shadow-2xl overflow-hidden flex flex-col justify-between p-6 border-8 border-gray-800">
        <div className="flex justify-between items-center pt-6">
          <ArrowLeft className="w-5 h-5 cursor-pointer" />
          <h1 className="text-base font-bold">Registrar quantidade</h1>
          <div className="w-8 h-8 bg-[#C58A32] text-[#0B1726] font-bold rounded-full flex items-center justify-center text-xs">CA</div>
        </div>

        {/* Barra de Progresso */}
        <div className="flex gap-1">
          <div className="h-1.5 bg-green-600 flex-1 rounded-full"></div>
          <div className="h-1.5 bg-[#C58A32] flex-1 rounded-full"></div>
          <div className="h-1.5 bg-gray-200 flex-1 rounded-full"></div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#D9E0E7] space-y-1">
          <div className="flex items-center gap-2 font-bold text-xs text-green-700">
            <CheckCircle2 className="w-4 h-4" /> REC-00482 confirmado
          </div>
          <p className="text-[11px] text-[#667085]">Bombona · capacidade 200 L</p>
        </div>

        <div className="bg-white p-6 rounded-xl border-2 border-[#C58A32] text-center space-y-2 shadow-sm">
          <span className="text-[10px] text-[#667085] font-bold block">QUANTIDADE COLETADA</span>
          <div className="text-4xl font-black text-[#0B1726]">176 L</div>
          <p className="text-[11px] text-green-700 font-medium">4 L abaixo da estimativa · dentro da tolerância</p>
        </div>

        <div className="space-y-3">
          <input type="text" placeholder="Observação (Opcional)" className="w-full p-3 border rounded-lg text-xs" />
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-[11px] text-blue-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>Confirme a quantidade medida antes de prosseguir.</span>
          </div>
        </div>

        <button className="w-full py-3.5 bg-[#0B1726] text-white rounded-xl text-xs font-bold hover:bg-[#16324F]">
          Confirmar quantidade →
        </button>
      </div>
    </div>
  );
}