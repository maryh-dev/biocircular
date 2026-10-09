import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, firebaseConfigured, firebaseConfigMissing } from '../../services/firebase.js';
import { definirNomePendente } from '../../services/db.js';

const mensagemErro = (error) => {
  const code = error?.code || '';
  if (code.includes('invalid-credential') || code.includes('user-not-found') || code.includes('wrong-password')) return 'E-mail ou senha inválidos.';
  if (code.includes('email-already-in-use')) return 'Este e-mail já tem cadastro. Use "Entrar".';
  if (code.includes('weak-password')) return 'A senha precisa ter pelo menos 6 caracteres.';
  if (code.includes('too-many-requests')) return 'Muitas tentativas. Aguarde um pouco e tente novamente.';
  if (code.includes('network-request-failed')) return 'Falha de conexão. Verifique sua internet.';
  if (code.includes('invalid-email')) return 'Informe um e-mail válido.';
  if (code.includes('operation-not-allowed')) return 'Ative o método E-mail/senha em Authentication > Método de login no Firebase.';
  return 'Não foi possível concluir a operação. Confira a configuração do Firebase e tente novamente.';
};

export default function Login({ erroInicial }) {
  const [modo, setModo] = useState('entrar');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(erroInicial ? { type: 'error', text: erroInicial } : null);
  const cadastro = modo === 'cadastrar';

  // Depois de autenticar, o App carrega (ou cria) o perfil e abre a tela certa.
  async function handleSubmit(event) {
    event.preventDefault();
    setStatus(null);
    if (!firebaseConfigured) {
      setStatus({ type: 'error', text: `Configure o arquivo .env.local. Faltam: ${firebaseConfigMissing.join(', ')}.` });
      return;
    }
    setLoading(true);
    try {
      if (cadastro) {
        definirNomePendente(nome.trim());
        await createUserWithEmailAndPassword(auth, email.trim(), senha);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), senha);
      }
      setStatus({ type: 'success', text: 'Tudo certo. Abrindo sua área de trabalho…' });
    } catch (error) {
      setStatus({ type: 'error', text: mensagemErro(error) });
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordReset() {
    setStatus(null);
    if (!email.trim()) {
      setStatus({ type: 'error', text: 'Digite seu e-mail no campo acima para receber o link de recuperação.' });
      return;
    }
    if (!firebaseConfigured) {
      setStatus({ type: 'error', text: 'Configure primeiro o Firebase no arquivo .env.local.' });
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setStatus({ type: 'success', text: 'Se houver uma conta cadastrada para esse e-mail, você receberá as instruções de recuperação.' });
    } catch (error) {
      setStatus({ type: 'error', text: mensagemErro(error) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-bioclube-dark font-sans">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white">
        <div>
          <div className="flex items-center gap-2 mb-16">
            <span className="bg-bioclube-amber text-bioclube-dark font-bold px-2.5 py-1 rounded text-sm">BC</span>
            <span className="font-bold tracking-wider text-lg">BIOCIRCULAR</span>
          </div>
          <h1 className="text-4xl font-extrabold leading-tight mb-4 max-w-lg">Gestão operacional do OGR, do gerador ao destino.</h1>
          <p className="text-gray-400 text-sm max-w-md">Controle solicitações, coletas, lotes e destinação com rastreabilidade e consistência.</p>
        </div>
        <div className="relative rounded-lg overflow-hidden border border-gray-800 shadow-2xl">
          <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800" alt="Operação de armazém" className="w-full h-48 object-cover opacity-80" />
        </div>
      </div>

      <div className="w-full lg:w-1/2 bg-bioclube-light flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-bioclube-border">
          <h2 className="text-2xl font-bold text-bioclube-textMain mb-2">{cadastro ? 'Criar conta' : 'Acesse sua operação'}</h2>
          <p className="text-xs text-bioclube-textSub mb-8">{cadastro ? 'Novas contas entram como Gerador. O administrador pode alterar o perfil depois.' : 'Entre com suas credenciais BIOCIRCULAR.'}</p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {cadastro && (
              <div>
                <label htmlFor="login-nome" className="block text-xs font-semibold text-bioclube-textMain mb-1">Nome</label>
                <input id="login-nome" type="text" autoComplete="name" required value={nome} onChange={(e) => setNome(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-bioclube-border rounded-md focus:outline-none focus:ring-2 focus:ring-bioclube-amber" placeholder="Seu nome ou da empresa" />
              </div>
            )}
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-bioclube-textMain mb-1">E-mail</label>
              <input id="login-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-bioclube-border rounded-md focus:outline-none focus:ring-2 focus:ring-bioclube-amber" placeholder="voce@empresa.com.br" />
            </div>
            <div>
              <label htmlFor="login-senha" className="block text-xs font-semibold text-bioclube-textMain mb-1">Senha</label>
              <input id="login-senha" type="password" autoComplete={cadastro ? 'new-password' : 'current-password'} required value={senha} onChange={(e) => setSenha(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-bioclube-border rounded-md focus:outline-none focus:ring-2 focus:ring-bioclube-amber" placeholder="Sua senha" />
            </div>
            <div className="flex items-center justify-end text-xs text-bioclube-textSub">
              <button type="button" onClick={handlePasswordReset} disabled={loading} className="hover:underline text-bioclube-dark font-medium disabled:opacity-50">Esqueci minha senha</button>
            </div>
            {status && <p role="status" aria-live="polite" className={`text-sm rounded-md p-3 ${status.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{status.text}</p>}
            <button type="submit" disabled={loading} className="w-full py-3 bg-bioclube-dark text-white text-sm font-bold rounded-md hover:bg-bioclube-secondary transition-colors mt-2 disabled:opacity-60">{loading ? 'Aguarde…' : cadastro ? 'Criar conta' : 'Entrar'}</button>
            <button type="button" onClick={() => { setModo(cadastro ? 'entrar' : 'cadastrar'); setStatus(null); }} className="w-full text-xs text-bioclube-dark font-medium hover:underline">
              {cadastro ? 'Já tenho conta — entrar' : 'Não tenho conta — criar agora'}
            </button>
          </form>
          <div className="mt-8 text-center text-[11px] text-bioclube-textSub flex items-center justify-center gap-1"><span>🔒</span> Ambiente seguro e acesso por perfil operacional</div>
        </div>
      </div>
    </div>
  );
}
