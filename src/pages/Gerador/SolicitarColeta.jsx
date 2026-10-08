import React from 'react';
import { useNavigate } from '../../components/NavigationContext';

export default function SolicitarColeta() {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-full bg-bioclube-light font-sans">
      <main className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-bioclube-textMain">Solicitar recolha</h1>
          <p className="mt-1 text-sm sm:text-base text-bioclube-textSub">Informe o recipiente e escolha a melhor janela.</p>
        </header>

        <div className="rounded-xl border border-bioclube-border bg-white shadow-sm flex flex-col overflow-hidden mb-8">

          <div className="border-b border-bioclube-border px-4 sm:px-8 py-4 sm:py-6 overflow-x-auto">
            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-medium min-w-max">
              <div className="flex items-center gap-1.5 sm:gap-2 text-bioclube-dark">
                <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-bioclube-dark text-[10px] sm:text-xs text-white">1</span>
                Recipiente
              </div>
              <div className="h-px w-8 sm:w-16 md:w-24 bg-bioclube-border"></div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-bioclube-dark">
                <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-bioclube-dark text-[10px] sm:text-xs text-white">2</span>
                Data e janela
              </div>
              <div className="h-px w-8 sm:w-16 md:w-24 bg-bioclube-light border-t border-bioclube-border"></div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-bioclube-textSub">
                <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full border border-bioclube-border text-[10px] sm:text-xs">3</span>
                Revisão
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">

            <div className="flex-1 p-4 sm:p-6 lg:p-8 order-2 lg:order-1">
              <h2 className="mb-4 sm:mb-6 text-lg sm:text-xl font-bold text-bioclube-textMain">Data e janela de recolha</h2>

              <form className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="flex flex-col">
                    <label htmlFor="data" className="mb-1.5 block text-xs sm:text-sm font-medium text-bioclube-textMain">Data preferencial</label>
                    <input id="data" type="date" defaultValue="2026-09-27" className="w-full rounded-lg border border-bioclube-border px-3 sm:px-4 py-3 sm:py-2.5 text-sm sm:text-base focus:border-bioclube-amber focus:ring-1 focus:ring-bioclube-amber focus:outline-none" />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="janela" className="mb-1.5 block text-xs sm:text-sm font-medium text-bioclube-textMain">Janela de horário</label>
                    <select id="janela" className="w-full rounded-lg border border-bioclube-border px-3 sm:px-4 py-3 sm:py-2.5 text-sm sm:text-base focus:border-bioclube-amber focus:ring-1 focus:ring-bioclube-amber focus:outline-none bg-white">
                      <option>10:00–11:00</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="end" className="mb-1.5 block text-xs sm:text-sm font-medium text-bioclube-textMain">Morada</label>
                  <input id="end" type="text" readOnly defaultValue="Rua dos Pinheiros, 842 · SP" className="w-full rounded-lg border border-bioclube-border bg-bioclube-light px-3 sm:px-4 py-3 sm:py-2.5 text-sm sm:text-base text-bioclube-textSub cursor-not-allowed" />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="obs" className="mb-1.5 block text-xs sm:text-sm font-medium text-bioclube-textMain">Observações para o coletor</label>
                  <textarea id="obs" rows="2" placeholder="Ex.: acesso pela entrada lateral" className="w-full rounded-lg border border-bioclube-border px-3 sm:px-4 py-3 text-sm sm:text-base focus:border-bioclube-amber focus:ring-1 focus:ring-bioclube-amber focus:outline-none resize-none"></textarea>
                </div>

                <div className="flex items-start gap-2 sm:gap-3 rounded-lg bg-blue-50 p-3 sm:p-4 text-xs sm:text-sm text-blue-800">
                  <span aria-hidden="true" className="mt-0.5">ℹ️</span> A disponibilidade será confirmada pela operação.
                </div>

                <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row justify-between border-t border-bioclube-border pt-6 gap-3">
                  <button type="button" onClick={() => navigate('gerador-dash')} className="w-full sm:w-auto rounded-lg border border-bioclube-border px-5 py-3 sm:py-2.5 text-sm sm:text-base font-medium text-bioclube-textMain hover:bg-bioclube-light transition-colors">Voltar</button>
                  <button type="button" onClick={() => navigate('op-detalhes')} className="w-full sm:w-auto rounded-lg bg-bioclube-dark px-5 py-3 sm:py-2.5 text-sm sm:text-base font-medium text-white hover:bg-bioclube-secondary transition-colors">Revisar solicitação</button>
                </div>
              </form>
            </div>

            <div className="w-full lg:w-96 border-b lg:border-b-0 lg:border-l border-bioclube-border bg-bioclube-light p-4 sm:p-6 lg:p-8 order-1 lg:order-2">
              <div className="rounded-xl border border-bioclube-border bg-white p-4 sm:p-6 shadow-sm">
                <h3 className="mb-4 sm:mb-6 text-base sm:text-lg font-bold text-bioclube-textMain">Resumo</h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-4">
                    <div>
                      <p className="text-[10px] sm:text-xs font-semibold uppercase text-bioclube-textSub">Gerador</p>
                      <p className="text-sm sm:text-base font-medium text-bioclube-textMain break-words">Bistrô da Serra</p>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs font-semibold uppercase text-bioclube-textSub">Recipiente</p>
                      <p className="text-sm sm:text-base font-medium text-bioclube-textMain">REC-00482</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-bioclube-border lg:border-none">
                    <div className="mb-1 flex justify-between text-xs sm:text-sm font-medium mt-2 lg:mt-0">
                      <span className="text-bioclube-textSub">Ocupação (180/200L)</span>
                      <span className="text-bioclube-textMain">90%</span>
                    </div>
                    <div className="h-2 sm:h-2.5 w-full rounded-full bg-bioclube-light overflow-hidden">
                      <div className="h-full rounded-full bg-bioclube-amber w-[90%]"></div>
                    </div>
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
