import React, { useCallback, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  BarChart3,
  Calendar,
  ClipboardList,
  Droplet,
  FileText,
  Home,
  Users,
  LogOut,
  MapPin,
  Package,
  Plus,
  QrCode,
  Recycle,
  Truck,
} from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db, firebaseConfigured } from './services/firebase.js';
import { carregarOuCriarPerfil } from './services/db.js';

import Login from './pages/Login/Login';
import DashboardGerador from './pages/Gerador/DashboardGerador';
import SolicitarColeta from './pages/Gerador/SolicitarColeta';
import MinhasSolicitacoes from './pages/Gerador/MinhasSolicitacoes';
import RecipienteDetalhes from './pages/Gerador/RecipienteDetalhes';
import SolicitacoesOperacao from './pages/Operacao/SolicitacoesOperacao';
import PlanejamentoRota from './pages/Operacao/PlanejamentoRota';
import Lotes from './pages/Operacao/Lotes';
import Indicadores from './pages/Operacao/Indicadores';
import Recebimento from './pages/Operacao/Recebimento';
import ColetorInicio from './pages/Coletor/ColetorInicio';
import LerQRCode from './pages/Coletor/LerQRCode';
import RegistrarQuantidade from './pages/Coletor/RegistrarQuantidade';
import RegistroDestinacao from './pages/Destino/RegistroDestinacao';
import LandingPage from './pages/Landing/LandingPage';
import UsuariosAdmin from './pages/Admin/UsuariosAdmin';

const PERFIS = {
  gerador: {
    nome: 'Gerador',
    secoes: [{
      titulo: 'Minha operação',
      paginas: [
        { id: 'gerador-dash', rotulo: 'Visão geral', icone: Home },
        { id: 'gerador-solicitar', rotulo: 'Solicitar coleta', icone: Plus },
        { id: 'gerador-minhas', rotulo: 'Solicitações', icone: ClipboardList },
        { id: 'gerador-recipiente', rotulo: 'Recipientes', icone: Package },
      ],
    }],
  },
  operador: {
    nome: 'Operação',
    secoes: [{
      titulo: 'Central operacional',
      paginas: [
        { id: 'op-solicitacoes', rotulo: 'Solicitações', icone: ClipboardList },
        { id: 'op-rota', rotulo: 'Rotas', icone: MapPin },
        { id: 'op-lotes', rotulo: 'Lotes', icone: Package },
        { id: 'op-indicadores', rotulo: 'Indicadores', icone: BarChart3 },
        { id: 'op-recebimento', rotulo: 'Recebimento', icone: Truck },
      ],
    }],
  },
  coletor: {
    nome: 'Coletor',
    secoes: [{
      titulo: 'Minha rota',
      paginas: [
        { id: 'coletor-inicio', rotulo: 'Início', icone: Home },
        { id: 'coletor-qr', rotulo: 'Ler QR Code', icone: QrCode },
        { id: 'coletor-qtd', rotulo: 'Registrar coleta', icone: Droplet },
      ],
    }],
  },
  destino: {
    nome: 'Destino final',
    secoes: [{
      titulo: 'Destinação',
      paginas: [
        { id: 'destino-reg', rotulo: 'Registrar destinação', icone: Recycle },
      ],
    }],
  },
  admin: {
    nome: 'Administrador',
    secoes: [{
      titulo: 'Administração',
      paginas: [{ id: 'admin-usuarios', rotulo: 'Usuários', icone: Users }],
    }],
  },
};

const TELAS_POR_PERFIL = Object.fromEntries(
  Object.entries(PERFIS).map(([role, perfil]) => [
    role,
    perfil.secoes.flatMap((secao) => secao.paginas.map(({ id }) => id)),
  ])
);

const TELA_INICIAL = {
  gerador: 'gerador-dash',
  coletor: 'coletor-inicio',
  destino: 'destino-reg',
  operador: 'op-solicitacoes',
  admin: 'admin-usuarios',
};

export default function App() {
  const [tela, setTela] = useState('landing');
  const [coletaAtual, setColetaAtual] = useState(null);
  const [codigoRecipiente, setCodigoRecipiente] = useState('');

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
        setColetaAtual(null);
        setCodigoRecipiente('');
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
          error?.code === 'account-disabled'
            ? 'O acesso desta conta ao aplicativo foi removido. Fale com um administrador.'
            : error?.code === 'permission-denied'
            ? 'O Firestore recusou o acesso ao seu perfil. Confira se as regras (firestore.rules) foram publicadas.'
            : 'Não foi possível carregar seu perfil. Verifique a conexão e a configuração do Firebase.'
        );

        await signOut(auth);
        setTela('login');

        setSession({
          loading: false,
          user: null,
          profile: null,
        });
      }
    });
  }, []);

  useEffect(() => {
    const uid = session.user?.uid;
    if (!uid || !db) return undefined;

    return onSnapshot(
      doc(db, 'users', uid),
      (profileSnapshot) => {
        if (!profileSnapshot.exists() || profileSnapshot.data().ativo !== true) {
          setErroPerfil('O acesso desta conta ao aplicativo foi removido. Fale com um administrador.');
          setTela('login');
          signOut(auth).catch((error) => {
            console.error('Não foi possível encerrar a sessão suspensa:', error);
          });
          return;
        }

        const profile = profileSnapshot.data();
        setSession((atual) => (
          atual.user?.uid === uid
            ? { ...atual, profile }
            : atual
        ));
        setTela((atual) => {
          const permitidasParaPerfil = TELAS_POR_PERFIL[profile.role] || [];
          return permitidasParaPerfil.includes(atual)
            ? atual
            : TELA_INICIAL[profile.role] || 'landing';
        });
      },
      (error) => {
        console.error('Não foi possível acompanhar o perfil:', error);
      }
    );
  }, [session.user?.uid]);

  async function handleLogout() {
    await signOut(auth);
    setColetaAtual(null);
    setCodigoRecipiente('');
    setTela('landing');
  }

  const iniciarColeta = useCallback((coleta) => {
    setColetaAtual(coleta);
    setCodigoRecipiente('');
    setTela('coletor-qr');
  }, []);

  const concluirLeituraRecipiente = useCallback((codigo) => {
    setCodigoRecipiente(codigo);
    setTela('coletor-qtd');
  }, []);

  const role = session.profile?.role;
  const perfilAtual = PERFIS[role] || null;
  const permitidas = TELAS_POR_PERFIL[role] || [];

  const props = {
    session,
    onNavigate: setTela,
    coletaAtual,
    codigoRecipiente,
    onIniciarColeta: iniciarColeta,
    onRecipienteLido: concluirLeituraRecipiente,
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

      case 'admin-usuarios':
        return <UsuariosAdmin {...props} />;

      case 'landing':
      default:
        return <LandingPage onNavigate={setTela} />;
    }
  }

  const mostrarMenu = tela !== 'landing' && tela !== 'login';

  return (
    <div className="flex min-h-screen flex-col bg-bioclube-light">
      {mostrarMenu && (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-bioclube-dark text-white shadow-lg shadow-slate-900/10">
          <div className="flex min-h-[68px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setTela(TELA_INICIAL[role] || 'landing')}
              className="flex min-w-0 items-center gap-3 rounded-xl text-left transition hover:opacity-90"
              aria-label="Ir para o início da sua área"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-bioclube-amber text-xs font-black tracking-tight text-bioclube-dark shadow-md shadow-black/10">
                BC
              </span>
              <span className="hidden min-w-0 sm:block">
                <span className="block text-sm font-extrabold tracking-[0.12em]">BIOCIRCULAR</span>
                <span className="mt-0.5 block text-[10px] text-slate-400">Gestão e rastreabilidade</span>
              </span>
            </button>

            <div className="flex min-w-0 items-center gap-3">
              {session.user && (
                <>
                  <div className="hidden min-w-0 text-right sm:block">
                    <p className="max-w-[220px] truncate text-xs font-semibold text-white">
                      {session.profile?.nome || session.user.email}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-400">
                      {perfilAtual?.nome || role}
                    </p>
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 text-xs font-bold text-bioclube-amber sm:hidden">
                    {(session.profile?.nome || session.user.email || 'U')
                      .split(/[\s@.]+/)
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((parte) => parte[0])
                      .join('')
                      .toUpperCase()}
                  </span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-red-400/40 hover:bg-red-500/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bioclube-amber"
                  >
                    <LogOut aria-hidden="true" className="h-4 w-4" />
                    <span className="hidden sm:inline">Sair</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {perfilAtual && (
            <div className="border-t border-white/[0.08]">
              <nav
                aria-label={`Páginas de ${perfilAtual.nome}`}
                className="flex gap-5 overflow-x-auto px-4 py-2.5 sm:px-6 lg:px-8"
              >
                {perfilAtual.secoes.map((secao) => (
                  <div key={secao.titulo} className="flex shrink-0 items-center gap-2.5">
                    <span className="hidden text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500 xl:inline">
                      {secao.titulo}
                    </span>
                    {secao.paginas.map(({ id, rotulo, icone: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setTela(id)}
                        aria-current={tela === id ? 'page' : undefined}
                        className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                          tela === id
                            ? 'bg-bioclube-amber text-bioclube-dark shadow-sm'
                            : 'text-slate-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {Icon && <Icon aria-hidden="true" className="h-4 w-4" />}
                        {rotulo}
                      </button>
                    ))}
                  </div>
                ))}
              </nav>
            </div>
          )}
        </header>
      )}

      <main key={tela} className="flex-1">
        {renderTela()}
      </main>


    </div>
  );
}