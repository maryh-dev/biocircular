import React from 'react';
import { ArrowLeft, Flashlight, Keyboard } from 'lucide-react';

export default function LerQRCode() {
  return (
    <div className="flex justify-center bg-gray-900 min-h-screen py-6">
      <div className="w-[375px] bg-[#0B1726] text-white min-h-[812px] rounded-[40px] shadow-2xl overflow-hidden flex flex-col justify-between p-6 border-8 border-gray-800">
        <div className="flex justify-between items-center pt-6">
          <ArrowLeft className="w-5 h-5 text-white cursor-pointer" />
          <h1 className="text-base font-bold">Ler QR Code</h1>
          <div className="w-8 h-8 bg-[#C58A32] text-[#0B1726] font-bold rounded-full flex items-center justify-center text-xs">CA</div>
        </div>

        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold text-[#C58A32] tracking-wider uppercase">Etapa 1 de 3</span>
          <p className="text-xs text-gray-300">Posicione o código do recipiente dentro da moldura.</p>
        </div>

        {/* Moldura de Leitura */}
        <div className="w-full h-72 border-2 border-[#C58A32] rounded-2xl flex flex-col items-center justify-center relative bg-black/20">
          <div className="absolute w-32 h-0.5 bg-[#C58A32]"></div>
        </div>

        <div className="flex justify-around items-center pt-4">
          <div className="flex flex-col items-center text-xs text-gray-300 gap-1">
            <span className="p-3 bg-white/10 rounded-full"><Flashlight className="w-4 h-4" /></span> Lanterna
          </div>
          <div className="flex flex-col items-center text-xs text-gray-300 gap-1">
            <span className="p-3 bg-white/10 rounded-full"><Keyboard className="w-4 h-4" /></span> Digitar código
          </div>
        </div>

        <div className="text-center text-[10px] text-gray-400 pb-2">
          SOL-2026-00984 · Bistrô da Serra
        </div>
      </div>
    </div>
  );
}