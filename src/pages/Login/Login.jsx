import React from 'react';
import { useNavigate } from '../../components/NavigationContext';

export default function Login() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen w-full bg-bioclube-dark font-sans flex-col lg:flex-row overflow-y-auto">

      {/* Painel Esquerdo: Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-8 lg:p-12 xl:p-16 text-white">
        <div>
          <button
            type="button"
            onClick={() => navigate('landing')}
            className="flex items-center gap-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-bioclube-amber"
            aria-label="Voltar para a página inicial BIOCIRCULAR"
          >
            <span className="bg-bioclube-amber text-bioclube-dark font-bold px-2.5 py-1 rounded text-sm md:text-base">
              BC
            </span>
            <span className="font-bold tracking-wider text-base lg:text-lg">BIOCIRCULAR</span>
          </button>

          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold leading-tight mb-4 max-w-lg">
            Gestão operacional do OGR, do gerador ao destino.
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-md">
            Controle solicitações, coletas, lotes e destinação com rastreabilidade e consistência.
          </p>
        </div>

        <div className="relative rounded-lg overflow-hidden border border-gray-800 shadow-2xl h-48 lg:h-64 mt-8">
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d"
            alt="Operação de Armazém"
            className="w-full h-full object-cover opacity-80"
          />
        </div>
      </div>

      {/* Painel Direito: Formulário */}
      <div className="w-full lg:w-1/2 bg-bioclube-light flex items-center justify-center p-4 sm:p-8 lg:p-16 my-auto">
        <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-bioclube-border my-auto">

          <button
            type="button"
            onClick={() => navigate('landing')}
            className="flex lg:hidden items-center gap-2 mb-8 justify-center rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-bioclube-amber"
            aria-label="Voltar para a página inicial BIOCIRCULAR"
          >
             <span className="bg-bioclube-amber text-bioclube-dark font-bold px-2 py-0.5 rounded text-xs">BC</span>
             <span className="font-bold tracking-wider text-sm text-bioclube-dark">BIOCIRCULAR</span>
          </button>

          <h2 className="text-xl sm:text-2xl font-bold text-bioclube-textMain mb-2 text-center lg:text-left">
            Acesse sua operação
          </h2>
          <p className="text-xs sm:text-sm text-bioclube-textSub mb-8 text-center lg:text-left">
            Entre com suas credenciais BIOCIRCULAR.
          </p>

          <form className="space-y-4 sm:space-y-5" onSubmit={(e) => { e.preventDefault(); navigate('op-dashboard'); }}>
            <div className="email-field">
              <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-bioclube-textMain mb-1.5">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue="marina@biocircular.com.br"
                className="w-full px-4 py-3 sm:py-2.5 text-sm sm:text-base border border-bioclube-border rounded-md focus:outline-none focus:ring-2 focus:ring-bioclube-amber"
              />
            </div>

            <div className="password-field">
              <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-bioclube-textMain mb-1.5">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                defaultValue="********"
                className="w-full px-4 py-3 sm:py-2.5 text-sm sm:text-base border border-bioclube-border rounded-md focus:outline-none focus:ring-2 focus:ring-bioclube-amber"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-bioclube-textSub pt-2">
              <label className="flex items-center gap-2 cursor-pointer w-full sm:w-auto">
                <input type="checkbox" defaultChecked className="cursor-pointer w-4 h-4 rounded border-bioclube-border text-bioclube-amber focus:ring-bioclube-amber" />
                Lembrar acesso
              </label>
              <button type="button" onClick={() => window.alert('Fluxo de recuperação disponível na integração com o backend.')} className="hover:underline text-bioclube-dark font-medium w-full sm:w-auto text-left sm:text-right">
                Esqueci minha senha
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 sm:py-3 bg-bioclube-dark text-white text-sm sm:text-base font-bold rounded-md hover:bg-bioclube-secondary transition-colors mt-4 sm:mt-2"
            >
              Entrar
            </button>
          </form>

          <div className="mt-8 text-center text-[11px] sm:text-xs text-bioclube-textSub flex items-center justify-center gap-1">
            <span aria-hidden="true">🔒</span> Ambiente seguro
          </div>
        </div>
      </div>

    </div>
  );
}
