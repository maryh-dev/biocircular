import React, { useRef } from 'react';
import { Search, Bell, Download, Plus } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function RecipienteDetalhes({ onNavigate }) {
  const qrRef = useRef(null);
  const codigoRecipiente = 'REC-00482';

  function baixarEtiqueta() {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    const arquivo = new Blob(
      [new XMLSerializer().serializeToString(svg)],
      { type: 'image/svg+xml;charset=utf-8' }
    );
    const url = URL.createObjectURL(arquivo);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${codigoRecipiente}.svg`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  return (
    <div className="flex min-h-screen bg-bioclube-light font-sans text-bioclube-textMain">
      <aside className="hidden lg:flex lg:w-64 flex-shrink-0 bg-bioclube-dark text-white flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-2 mb-10">
            <span className="bg-bioclube-amber text-bioclube-dark font-bold px-2 py-0.5 rounded text-xs">BC</span>
            <span className="font-bold tracking-wider text-sm">BIOCIRCULAR</span>
          </div>
          <nav className="space-y-1">
            <button type="button" onClick={() => onNavigate?.('gerador-dash')} className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white text-sm font-medium">Dashboard</button>
            <button type="button" onClick={() => onNavigate?.('gerador-minhas')} className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white text-sm font-medium">Solicitações</button>
            <span aria-current="page" className="flex items-center gap-3 px-3 py-2.5 bg-bioclube-secondary rounded-md text-sm font-medium border-l-4 border-bioclube-amber">Recipientes</span>
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-bioclube-border px-4 md:px-8 flex items-center justify-between">
          <span className="text-xs text-bioclube-textSub">BIOCIRCULAR / <strong className="text-bioclube-textMain">Recipientes</strong></span>
          <div className="flex items-center gap-4"><Search className="w-4 h-4 text-gray-400" /><Bell className="w-4 h-4 text-gray-400" /></div>
        </header>

        <div className="p-4 md:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Recipiente {codigoRecipiente}</h1>
              <p className="text-xs text-bioclube-textSub mt-1">QR de demonstração para testar leitura e validação de coleta.</p>
            </div>
            <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">Ativo</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Bloco QR Code */}
            <div className="bg-white p-6 rounded-xl border border-bioclube-border shadow-sm flex flex-col items-center justify-center text-center">
              <div ref={qrRef} className="mb-4 flex h-48 w-48 items-center justify-center rounded-lg border border-gray-200 bg-white p-3">
                <QRCodeSVG value={codigoRecipiente} size={176} level="M" title={`QR Code do recipiente ${codigoRecipiente}`} />
              </div>
              <h3 className="font-bold text-sm">{codigoRecipiente}</h3>
              <p className="mb-4 text-[11px] text-bioclube-textSub">Código ilustrativo; use este valor ao criar uma solicitação de teste.</p>
              <button type="button" onClick={baixarEtiqueta} className="flex w-full items-center justify-center gap-2 rounded-lg border border-bioclube-border py-2 text-xs font-bold">
                <Download className="h-3.5 w-3.5" /> Baixar QR Code
              </button>
            </div>

            {/* Informações do Recipiente */}
            <div className="space-y-6 md:col-span-2">
              <div className="bg-white p-6 rounded-xl border border-bioclube-border shadow-sm space-y-4">
                <h3 className="font-bold text-sm">Dados do recipiente</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div><span className="text-bioclube-textSub block">TIPO</span><strong>Bombona plástica</strong></div>
                  <div><span className="text-bioclube-textSub block">CAPACIDADE</span><strong>200 L</strong></div>
                  <div><span className="text-bioclube-textSub block">INSTALADO EM</span><strong>12/03/2026</strong></div>
                  <div><span className="text-bioclube-textSub block">LOCALIZAÇÃO</span><strong>Cozinha · doca lateral</strong></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-bioclube-textSub">Volume estimado</span>
                    <strong>180 de 200 L</strong>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-bioclube-amber h-full w-[90%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}