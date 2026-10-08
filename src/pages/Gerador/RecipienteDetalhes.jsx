import React from 'react';
import { useNavigate } from '../../components/NavigationContext';

export default function RecipienteDetalhes() {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-full bg-bioclube-light font-sans">
      <main className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-bioclube-textMain">Recipiente REC-00482</h1>
            <p className="mt-1 text-sm sm:text-base text-bioclube-textSub">Identificação e histórico de movimentações.</p>
          </div>
          <span className="self-start sm:self-auto rounded-full bg-green-100 px-3 py-1 text-xs sm:text-sm font-semibold text-green-800 border border-green-200">
            Ativo
          </span>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          <section className="rounded-xl border border-bioclube-border bg-white p-5 sm:p-6 shadow-sm flex flex-col">
            <div className="mb-6 flex aspect-square w-full max-w-[280px] lg:max-w-none mx-auto items-center justify-center rounded-xl bg-bioclube-light p-6 sm:p-8">
               <div className="grid h-24 w-24 sm:h-32 sm:w-32 grid-cols-2 gap-2 opacity-30" aria-hidden="true">
                  <div className="rounded border-4 border-bioclube-textMain"></div>
                  <div className="rounded border-4 border-bioclube-textMain"></div>
                  <div className="rounded border-4 border-bioclube-textMain"></div>
                  <div className="rounded-tl-full bg-bioclube-textMain"></div>
               </div>
            </div>
            <div className="mb-6 text-center flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-bioclube-textMain">REC-00482</h3>
              <p className="text-xs sm:text-sm text-bioclube-textSub mt-1">Bombona 200 L · Bistrô da Serra</p>
            </div>
            <button className="w-full rounded-lg border border-bioclube-border py-3 sm:py-2.5 text-sm sm:text-base font-medium text-bioclube-textMain hover:bg-bioclube-light transition-colors mt-auto">
              📦 Transferir etiqueta
            </button>
          </section>

          <div className="flex flex-col gap-6 lg:col-span-2">

            <section className="rounded-xl border border-bioclube-border bg-white p-5 sm:p-6 shadow-sm">
              <h2 className="mb-4 sm:mb-6 text-base sm:text-lg font-bold text-bioclube-textMain">Dados do recipiente</h2>

              <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] sm:text-xs font-semibold uppercase text-bioclube-textSub">Tipo</p>
                  <p className="text-sm sm:text-base font-medium text-bioclube-textMain">Bombona plástica</p>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs font-semibold uppercase text-bioclube-textSub">Capacidade</p>
                  <p className="text-sm sm:text-base font-medium text-bioclube-textMain">200 L</p>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs font-semibold uppercase text-bioclube-textSub">Instalado a</p>
                  <p className="text-sm sm:text-base font-medium text-bioclube-textMain">12/03/2026</p>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs font-semibold uppercase text-bioclube-textSub">Localização</p>
                  <p className="text-sm sm:text-base font-medium text-bioclube-textMain break-words">Cozinha · cais lateral</p>
                </div>
              </div>

              <div className="pt-4 border-t border-bioclube-border">
                <div className="mb-2 flex justify-between text-xs sm:text-sm font-medium">
                  <span className="text-bioclube-textSub">Volume estimado</span>
                  <span className="text-bioclube-textMain">180 de 200 L</span>
                </div>
                <div className="h-2.5 sm:h-3 w-full rounded-full bg-bioclube-light overflow-hidden">
                  <div className="h-full rounded-full bg-bioclube-amber w-[90%]"></div>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-bioclube-border bg-white p-5 sm:p-6 shadow-sm">
               <h2 className="mb-4 sm:mb-6 text-base sm:text-lg font-bold text-bioclube-textMain">Etiqueta e leitura</h2>
               <div className="mb-6 flex items-start gap-2 sm:gap-3 rounded-lg bg-blue-50 p-3 sm:p-4 text-xs sm:text-sm text-blue-800">
                  <span aria-hidden="true" className="mt-0.5">ℹ️</span> Mantenha a etiqueta visível. O coletor confirmará o recipiente na leitura do QR Code.
               </div>
               <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button className="w-full sm:w-auto rounded-lg border border-bioclube-border px-4 py-3 sm:py-2.5 text-sm sm:text-base font-medium text-bioclube-textMain hover:bg-bioclube-light transition-colors text-center">
                    📦 Transferir A6
                  </button>
                  <button onClick={() => navigate('gerador-solicitar')} className="w-full sm:w-auto rounded-lg bg-bioclube-dark px-4 py-3 sm:py-2.5 text-sm sm:text-base font-medium text-white hover:bg-bioclube-secondary transition-colors text-center">
                    Solicitar recolha
                  </button>
               </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
