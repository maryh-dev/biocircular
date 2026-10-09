
import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  auth,
  firebaseConfigured,
  firebaseConfigMissing,
} from '../../services/firebase.js';
import { definirNomePendente } from '../../services/db.js';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CircleHelp,
  Fingerprint,
  Leaf,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from 'lucide-react';

const mensagemErro = (error) => {
  const code = error?.code || '';

  if (
    code.includes('invalid-credential') ||
    code.includes('user-not-found') ||
    code.includes('wrong-password')
  ) {
    return 'E-mail ou senha inválidos.';
  }

  if (code.includes('email-already-in-use')) {
    return 'Este e-mail já tem cadastro. Use "Entrar".';
  }

  if (code.includes('weak-password')) {
    return 'A senha precisa ter pelo menos 6 caracteres.';
  }

  if (code.includes('too-many-requests')) {
    return 'Muitas tentativas. Aguarde um pouco e tente novamente.';
  }

  if (code.includes('network-request-failed')) {
    return 'Falha de conexão. Verifique sua internet.';
  }

  if (code.includes('invalid-email')) {
    return 'Informe um e-mail válido.';
  }

  if (code.includes('operation-not-allowed')) {
    return 'Ative o método E-mail/senha em Authentication > Método de login no Firebase.';
  }

  return 'Não foi possível concluir a operação. Confira a configuração do Firebase e tente novamente.';
};

function Marca({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-bioclube-amber text-sm font-extrabold tracking-tight text-bioclube-dark shadow-lg">
        BC
      </span>

      <div>
        <span
          className={`block text-base font-extrabold tracking-[0.12em] ${
            compact ? 'text-bioclube-textMain' : 'text-white'
          }`}
        >
          BIOCIRCULAR
        </span>

        <span
          className={`mt-0.5 block text-[10px] font-medium tracking-wide ${
            compact ? 'text-bioclube-textSub' : 'text-slate-400'
          }`}
        >
          Rastreabilidade e gestão operacional
        </span>
      </div>
    </div>
  );
}

function Campo({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  icon: Icon,
  required = true,
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-bioclube-textMain"
      >
        {label}
      </label>

      <div className="group relative">
        <Icon
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-bioclube-amber"
        />

        <input
          id={id}
          type={type}
          autoComplete={autoComplete}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-xl border border-bioclube-border bg-white py-3.5 pl-11 pr-4 text-sm text-bioclube-textMain outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-bioclube-amber focus:ring-4 focus:ring-amber-500/10"
        />
      </div>
    </div>
  );
}

export default function Login({ erroInicial, onNavigate }) {
  const [modo, setModo] = useState('entrar');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(
    erroInicial ? { type: 'error', text: erroInicial } : null
  );

  const cadastro = modo === 'cadastrar';

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus(null);

    if (!firebaseConfigured) {
      setStatus({
        type: 'error',
        text: `Configure o arquivo .env.local. Faltam: ${firebaseConfigMissing.join(', ')}.`,
      });
      return;
    }

    setLoading(true);

    try {
      if (cadastro) {
        definirNomePendente(nome.trim());
        await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          senha
        );
      } else {
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          senha
        );
      }

      setStatus({
        type: 'success',
        text: 'Tudo certo. Abrindo sua área de trabalho…',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        text: mensagemErro(error),
      });
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordReset() {
    setStatus(null);

    if (!email.trim()) {
      setStatus({
        type: 'error',
        text: 'Digite seu e-mail no campo acima para receber o link de recuperação.',
      });
      return;
    }

    if (!firebaseConfigured) {
      setStatus({
        type: 'error',
        text: 'Configure primeiro o Firebase no arquivo .env.local.',
      });
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email.trim());

      setStatus({
        type: 'success',
        text: 'Se houver uma conta cadastrada para esse e-mail, você receberá as instruções de recuperação.',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        text: mensagemErro(error),
      });
    } finally {
      setLoading(false);
    }
  }

  function alternarModo() {
    setModo(cadastro ? 'entrar' : 'cadastrar');
    setStatus(null);
  }

  return (
    <main className="relative min-h-screen bg-[#F3F6F9] font-sans text-bioclube-textMain lg:grid lg:grid-cols-2">
      {/* Seta discreta para voltar à página inicial */}
      <button
        type="button"
        onClick={() => onNavigate?.('landing')}
        aria-label="Voltar ao menu inicial"
        title="Voltar ao início"
        className="absolute left-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-all duration-200 hover:bg-white hover:text-slate-900 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 sm:left-6 sm:top-6 lg:left-8 lg:top-8"
      >
        <ArrowLeft
          aria-hidden="true"
          className="h-5 w-5"
          strokeWidth={1.8}
        />
      </button>

      {/* Painel institucional */}
      <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-bioclube-dark p-10 text-white lg:flex xl:p-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full border border-white/[0.07]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-[360px] w-[360px] rounded-full border border-white/[0.08]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-48 -left-32 h-[430px] w-[430px] rounded-full bg-emerald-500/[0.07] blur-3xl"
        />

        <div className="relative z-10">
          <Marca />

          <div className="mt-24 max-w-xl xl:mt-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-[11px] font-semibold tracking-wide text-slate-300">
              <Leaf className="h-4 w-4 text-bioclube-amber" />
              TECNOLOGIA PARA A ECONOMIA CIRCULAR
            </span>

            <h1 className="mt-7 text-4xl font-bold leading-[1.15] tracking-tight xl:text-5xl">
              Da coleta à destinação,
              <span className="mt-2 block text-bioclube-amber">
                cada etapa importa.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-slate-300">
              Organize a operação de óleo e gordura residual com uma visão
              integrada de solicitações, coletas, lotes e destinação final.
            </p>
          </div>

          {/* Resumo visual institucional */}
          <div className="mt-12 max-w-lg rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-sm xl:mt-14">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-bioclube-amber/15 text-bioclube-amber">
                  <Fingerprint className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Rastreabilidade operacional
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Origem, acompanhamento e destino
                  </p>
                </div>
              </div>

              <ShieldCheck
                aria-hidden="true"
                className="h-6 w-6 shrink-0 text-bioclube-amber"
              />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/10 pt-5">
              {[
                ['01', 'Identificação'],
                ['02', 'Coleta'],
                ['03', 'Destinação'],
              ].map(([numero, titulo]) => (
                <div key={numero}>
                  <span className="text-xs font-bold text-bioclube-amber">
                    {numero}
                  </span>

                  <p className="mt-1 text-xs font-medium text-slate-300">
                    {titulo}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-10 flex items-center justify-between gap-4 border-t border-white/10 pt-6 text-[11px] text-slate-400">
          <span>© 2026 BIOCIRCULAR</span>

          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Ambiente de acesso operacional
          </span>
        </div>
      </section>

      {/* Área de autenticação */}
      <section className="flex min-h-screen flex-col items-center justify-center px-5 py-8 sm:px-8 lg:px-12 xl:px-16">
        <div className="mb-8 w-full max-w-md lg:hidden">
          <Marca compact />
        </div>

        <div className="w-full max-w-md">
          <button
            type="button"
            onClick={alternarModo}
            className={`mb-6 inline-flex items-center gap-2 text-xs font-semibold text-bioclube-textSub transition-colors hover:text-bioclube-dark ${
              cadastro ? '' : 'invisible'
            }`}
            aria-label="Voltar para entrar"
            tabIndex={cadastro ? 0 : -1}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para entrar
          </button>

          <div className="rounded-2xl border border-bioclube-border bg-white p-6 shadow-[0_18px_60px_-25px_rgba(15,35,55,0.18)] sm:p-9">
            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F8EEDC] text-bioclube-dark">
                {cadastro ? (
                  <UserRound className="h-6 w-6" />
                ) : (
                  <LockKeyhole className="h-6 w-6" />
                )}
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.16em] text-bioclube-amber">
                {cadastro ? 'Novo acesso' : 'Área restrita'}
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-bioclube-textMain sm:text-[28px]">
                {cadastro ? 'Crie sua conta' : 'Bem-vindo de volta'}
              </h2>

              <p className="mt-3 text-sm leading-6 text-bioclube-textSub">
                {cadastro
                  ? 'Preencha os dados abaixo para criar seu acesso à plataforma.'
                  : 'Entre com suas credenciais para acessar a operação BIOCIRCULAR.'}
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {cadastro && (
                <Campo
                  id="login-nome"
                  label="Nome"
                  type="text"
                  autoComplete="name"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome ou da empresa"
                  icon={UserRound}
                />
              )}

              <Campo
                id="login-email"
                label="E-mail corporativo ou pessoal"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@empresa.com.br"
                icon={Mail}
              />

              <Campo
                id="login-senha"
                label="Senha"
                type="password"
                autoComplete={cadastro ? 'new-password' : 'current-password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder={cadastro ? 'Crie uma senha' : 'Digite sua senha'}
                icon={LockKeyhole}
              />

              {!cadastro && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-bioclube-dark transition-colors hover:text-bioclube-amber disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CircleHelp className="h-3.5 w-3.5" />
                    Esqueci minha senha
                  </button>
                </div>
              )}

              {status && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`flex gap-3 rounded-xl border p-4 text-sm leading-5 ${
                    status.type === 'error'
                      ? 'border-red-200 bg-red-50 text-red-800'
                      : 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  }`}
                >
                  {status.type === 'error' ? (
                    <CircleHelp className="mt-0.5 h-5 w-5 shrink-0" />
                  ) : (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                  )}

                  <span>{status.text}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-bioclube-dark px-5 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-bioclube-secondary hover:shadow-md focus:outline-none focus:ring-4 focus:ring-slate-400/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? 'Aguarde…'
                  : cadastro
                    ? 'Criar conta'
                    : 'Entrar na plataforma'}

                {!loading && (
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                )}
              </button>

              <div className="relative flex items-center gap-3 py-1">
                <div className="h-px flex-1 bg-bioclube-border" />

                <span className="text-[10px] font-medium uppercase tracking-wider text-bioclube-textSub">
                  ou
                </span>

                <div className="h-px flex-1 bg-bioclube-border" />
              </div>

              <p className="text-center text-sm text-bioclube-textSub">
                {cadastro
                  ? 'Já possui uma conta?'
                  : 'Ainda não tem uma conta?'}{' '}

                <button
                  type="button"
                  onClick={alternarModo}
                  className="font-bold text-bioclube-dark underline-offset-4 transition-colors hover:text-bioclube-amber hover:underline"
                >
                  {cadastro ? 'Entrar' : 'Criar conta'}
                </button>
              </p>
            </form>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 px-2 text-center text-[11px] leading-5 text-bioclube-textSub">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-700" />
            <span>
              Seu acesso é protegido e gerenciado pela plataforma.
            </span>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-slate-400 lg:hidden">
            <BarChart3 className="h-3.5 w-3.5" />
            BIOCIRCULAR · Gestão e rastreabilidade
          </div>
        </div>
      </section>
    </main>
  );
}
