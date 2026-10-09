import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, firebaseConfigured } from './services/firebase.js';
import { carregarOuCriarPerfil } from './services/db.js';

import Login from './pages/Login/Login';
import DashboardGerador from './pages/Gerador/DashboardGerador';
import SolicitarColeta from './pages/Gerador/SolicitarColeta';
import MinhasSolicitacoes from './pages/Gerador/MinhasSolicitacoes';
import RecipienteDetalhes from './pages/Gerador/RecipienteDetalhes';
import SolicitacoesOperacao from './pages/Operacao/SolicitacoesOperacao';
import DetalhesSolicitacao from './pages/Operacao/DetalhesSolicitacao';
import Agendamento from './pages/Operacao/Agendamento';
import PlanejamentoRota from './pages/Operacao/PlanejamentoRota';
import Lotes from './pages/Operacao/Lotes';
import Indicadores from './pages/Operacao/Indicadores';
import Recebimento from './pages/Operacao/Recebimento';
import ColetorInicio from './pages/Coletor/ColetorInicio';
import LerQRCode from './pages/Coletor/LerQRCode';
import RegistrarQuantidade from './pages/Coletor/RegistrarQuantidade';
import RegistroDestinacao from './pages/Destino/RegistroDestinacao';
import LandingPage from './pages/Landing/LandingPage';

const GERADOR = [
  'gerador-dash',
  'gerador-solicitar',
  'gerador-minhas',
  'gerador-recipiente',
];

const OPERACAO = [
  'op-solicitacoes',
  'op-detalhes',
  'op-agendamento',
  'op-rota',
  'op-lotes',
  'op-indicadores',
  'op-recebimento',
];

const COLETOR = [
  'coletor-inicio',
  'coletor-qr',
  'coletor-qtd',
];

const DESTINO = ['destino-reg'];

const TELAS_POR_PERFIL = {
  gerador: GERADOR,
  coletor: COLETOR,
  destino: DESTINO,
  operador: [...GERADOR, ...OPERACAO],
  admin: [...GERADOR, ...OPERACAO, ...COLETOR, ...DESTINO],
};

const TELA_INICIAL = {
  gerador: 'gerador-dash',
  coletor: 'coletor-inicio',
  destino: 'destino-reg',
  operador: 'op-solicitacoes',
  admin: 'op-solicitacoes',
};

const ROTULOS = {
  'gerador-dash': 'Painel Gerador',
  'gerador-solicitar': 'Solicitar Coleta',
  'gerador-minhas': 'Minhas Solicitações',
  'gerador-recipiente': 'Recipiente + QR',
  'op-solicitacoes': 'Solicitações',
  'op-detalhes': 'Detalhes',
  'op-agendamento': 'Agendamento',
  'op-rota': 'Mapa / Rota',
  'op-lotes': 'Lotes',
  'op-indicadores': 'Indicadores',
  'op-recebimento': 'Recebimento',
  'coletor-inicio': 'Início Coletor',
  'coletor-qr': 'Ler QR',
  'coletor-qtd': 'Quantidade Coletada',
  'destino-reg': 'Destino Final',
};

export default function App() {
  const [tela, setTela] = useState('landing');

  const [session, setSession] = useState({
    loading: true,
    user: null,
    profile: null,
  });

  const [erroPerfil, setErroPerfil] = useState(null);

  useEffect(() => {
    if (!firebaseConfigured) {
      setSession({
        loading: false,
        user: null,
        profile: null,
      });

      return undefined;
    }

    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setSession({
          loading: false,
          user: null,
          profile: null,
        });

        return;
      }

      try {
        const profile = await carregarOuCriarPerfil(user);

        setErroPerfil(null);

        setSession({
          loading: false,
          user,
          profile,
        });

        setTela((atual) =>
          atual === 'landing' || atual === 'login'
            ? TELA_INICIAL[profile.role] || 'landing'
            : atual
        );
      } catch (error) {
        console.error('Não foi possível carregar o perfil:', error);

        setErroPerfil(
          error?.code === 'permission-denied'
            ? 'O Firestore recusou o acesso ao seu perfil. Confira se as regras (firestore.rules) foram publicadas.'
            : 'Não foi possível carregar seu perfil. Verifique a conexão e a configuração do Firebase.'
        );

        await signOut(auth);

        setSession({
          loading: false,
          user: null,
          profile: null,
        });
      }
    });
  }, []);

  async function handleLogout() {
    await signOut(auth);
    setTela('landing');
  }

  const role = session.profile?.role;
  const permitidas = TELAS_POR_PERFIL[role] || [];

  const props = {
    session,
    onNavigate: setTela,
  };

  function renderTela() {
    if (session.loading) {
      return (
        <div className="m-8 text-gray-300">
          Carregando…
        </div>
      );
    }

    const publica = tela === 'landing' || tela === 'login';

    if (!publica && !session.user) {
      return (
        <Login
          erroInicial={erroPerfil}
          onNavigate={setTela}
        />
      );
    }

    if (!publica && !permitidas.includes(tela)) {
      return (
        <div className="m-8 rounded-xl bg-white p-6 text-gray-800 shadow-lg">
          <h2 className="mb-2 text-lg font-bold">
            Acesso não permitido
          </h2>

          <p>
            Seu perfil não tem permissão para acessar esta tela.
          </p>

          <button
            type="button"
            onClick={() => setTela('landing')}
            className="mt-4 rounded-lg bg-[#0B1726] px-4 py-2 text-white transition hover:bg-[#162b42]"
          >
            Voltar ao início
          </button>
        </div>
      );
    }

    switch (tela) {
      case 'login':
        return (
          <Login
            erroInicial={erroPerfil}
            onNavigate={setTela}
          />
        );

      case 'gerador-dash':
        return <DashboardGerador {...props} />;

      case 'gerador-solicitar':
        return <SolicitarColeta {...props} />;

      case 'gerador-minhas':
        return <MinhasSolicitacoes {...props} />;

      case 'gerador-recipiente':
        return <RecipienteDetalhes {...props} />;

      case 'op-solicitacoes':
        return <SolicitacoesOperacao {...props} />;

      case 'op-detalhes':
        return <DetalhesSolicitacao {...props} />;

      case 'op-agendamento':
        return <Agendamento {...props} />;

      case 'op-rota':
        return <PlanejamentoRota {...props} />;

      case 'op-lotes':
        return <Lotes {...props} />;

      case 'op-indicadores':
        return <Indicadores {...props} />;

      case 'op-recebimento':
        return <Recebimento {...props} />;

      case 'coletor-inicio':
        return <ColetorInicio {...props} />;

      case 'coletor-qr':
        return <LerQRCode {...props} />;

      case 'coletor-qtd':
        return <RegistrarQuantidade {...props} />;

      case 'destino-reg':
        return <RegistroDestinacao {...props} />;

      case 'landing':
      default:
        return <LandingPage onNavigate={setTela} />;
    }
  }

  const botao = (id, rotulo) => (
    <button
      key={id}
      type="button"
      onClick={() => setTela(id)}
      className={`
        rounded-lg px-3 py-2 text-xs whitespace-nowrap
        transition-colors duration-200
        ${
          tela === id
            ? 'bg-[#C58A32] font-bold text-[#0B1726]'
            : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
        }
      `}
    >
      {rotulo}
    </button>
  );

  const mostrarMenu = tela !== 'landing' && tela !== 'login';

  return (
    <div className="flex min-h-screen flex-col bg-gray-950">
      {mostrarMenu && (
        <header className="sticky top-0 z-50 border-b border-gray-800 bg-[#0B1726] text-white shadow-md">
          <div className="flex flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setTela('landing')}
                title="Voltar ao início"
                aria-label="Voltar ao início"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-300 transition hover:bg-gray-800 hover:text-white"
              >
                <span className="text-lg" aria-hidden="true">
                  ←
                </span>
              </button>

              <span className="mr-2 text-sm font-bold tracking-wide text-[#C58A32]">
                BIOCIRCULAR
              </span>

              <nav
                aria-label="Navegação principal"
                className="flex flex-1 flex-wrap gap-2"
              >
                {permitidas.map((id) => botao(id, ROTULOS[id]))}
              </nav>
            </div>

            {session.user && (
              <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-gray-800 pt-3 lg:border-0 lg:pt-0">
                <div className="min-w-0">
                  <p className="max-w-[260px] truncate text-xs text-gray-200">
                    {session.user.email}
                  </p>

                  <p className="mt-1 text-[10px] uppercase tracking-wider text-gray-400">
                    Perfil: {role}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg bg-red-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </header>
      )}

      <main key={tela} className="flex-1">
        {renderTela()}
      </main>


    </div>
  );
}
