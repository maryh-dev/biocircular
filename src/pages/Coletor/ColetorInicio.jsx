import React from 'react';
import { Home, Droplet, MapPin, ChevronRight, Navigation } from 'lucide-react';

export default function ColetorInicio() {
  return (
    <div className="flex justify-center bg-gray-900 min-h-screen py-6">
      {/* Moldura de Smartphone */}
      <div className="w-[375px] bg-[#F5F7FA] min-h-[812px] rounded-[40px] shadow-2xl overflow-hidden flex flex-col justify-between relative border-8 border-gray-800">
        
        {/* Header */}
        <div className="bg-white px-6 pt-12 pb-4 border-b border-[#D9E0E7] flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-[#17202A]">Início</h1>
          </div>
          <div className="w-9 h-9 bg-[#C58A32] text-[#0B1726] font-bold rounded-full flex items-center justify-center text-sm shadow-sm">
            CA
          </div>
        </div>

        {/* Corpo Scrollável */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          <div>
            <h2 className="text-xl font-extrabold text-[#0B1726]">Bom dia, Carlos</h2>
            <p className="text-xs text-[#667085]">Rota SP-08 · 27 de setembro</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-xl border border-[#D9E0E7] shadow-sm">
              <span className="text-2xl font-black text-[#17202A]">4</span>
              <p className="text-[11px] text-[#667085] mt-0.5">coletas</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#D9E0E7] shadow-sm">
              <span className="text-2xl font-black text-[#0B1726]">730 L</span>
              <p className="text-[11px] text-[#667085] mt-0.5">estimados</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#D9E0E7] shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-amber-700">10:00–11:00</span>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Agendada</span>
            </div>
            <h3 className="text-base font-bold text-[#17202A]">Bistrô da Serra</h3>
            <p className="text-xs text-[#667085] flex items-center gap-1 mt-1 mb-4">
              <MapPin className="w-3.5 h-3.5 text-gray-400" /> Rua dos Pinheiros, 842 · São Paulo
            </p>
            <button className="w-full py-3 bg-[#0B1726] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2">
              <Navigation className="w-4 h-4" /> Iniciar rota
            </button>
          </div>
        </div>

        {/* Bottom Navbar Mobile */}
        <div className="bg-white border-t border-[#D9E0E7] h-16 flex justify-around items-center px-4 text-xs font-medium text-[#667085]">
          <div className="flex flex-col items-center text-[#0B1726]"><Home className="w-5 h-5 mb-0.5" /> Início</div>
          <div className="flex flex-col items-center"><Droplet className="w-5 h-5 mb-0.5" /> Coletas</div>
          <div className="flex flex-col items-center"><MapPin className="w-5 h-5 mb-0.5" /> Rota</div>
        </div>

      </div>
    </div>
  );
}