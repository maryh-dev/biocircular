import React from 'react';

export default function Login() {
  return (
    <div className="flex min-h-screen w-full bg-bioclube-dark font-sans">
      {/* Lado Esquerdo - Branding e Imagem */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white">
        <div>
          <div className="flex items-center gap-2 mb-16">
            <span className="bg-bioclube-amber text-bioclube-dark font-bold px-2.5 py-1 rounded text-sm">BC</span>
            <span className="font-bold tracking-wider text-lg">BIOCIRCULAR</span>
          </div>
          <h1 className="text-4xl font-extrabold leading-tight mb-4 max-w-lg">
            Gestão operacional do OGR, do gerador ao destino.
          </h1>
          <p className="text-gray-400 text-sm max-w-md">
            Controle solicitações, coletas, lotes e destinação com rastreabilidade e consistência.
          </p>
        </div>
        
        {/* Imagem de armazém/fundo */}
        <div className="relative rounded-lg overflow-hidden border border-gray-800 shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800" 
            alt="Operação de Armazém" 
            className="w-full h-48 object-cover opacity-80"
          />
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-1/2 bg-bioclube-light flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-bioclube-border">
          <h2 className="text-2xl font-bold text-bioclube-textMain mb-2">Acesse sua operação</h2>
          <p className="text-xs text-bioclube-textSub mb-8">Entre com suas credenciais BIOCIRCULAR.</p>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs font-semibold text-bioclube-textMain mb-1">E-mail</label>
              <input 
                type="email" 
                defaultValue="marina@biocircular.com.br"
                className="w-full px-3 py-2.5 text-sm border border-bioclube-border rounded-md focus:outline-none focus:ring-2 focus:ring-bioclube-amber"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-bioclube-textMain mb-1">Senha</label>
              <input 
                type="password" 
                defaultValue="********"
                className="w-full px-3 py-2.5 text-sm border border-bioclube-border rounded-md focus:outline-none focus:ring-2 focus:ring-bioclube-amber"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-bioclube-textSub">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-bioclube-border text-bioclube-dark focus:ring-0" />
                Lembrar acesso
              </label>
              <a href="#" className="hover:underline text-bioclube-dark font-medium">Esqueci minha senha</a>
            </div>

            <button className="w-full py-3 bg-bioclube-dark text-white text-sm font-bold rounded-md hover:bg-bioclube-secondary transition-colors mt-2">
              Entrar
            </button>
          </form>

          <div className="mt-8 text-center text-[11px] text-bioclube-textSub flex items-center justify-center gap-1">
            <span>🔒</span> Ambiente seguro e acesso por perfil operacional
          </div>
        </div>
      </div>
    </div>
  );
}