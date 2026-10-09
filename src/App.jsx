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

const GERADOR = ['gerador-dash', 'gerador-solicitar', 'gerador-minhas', 'gerador-recipiente'];
const OPERACAO = ['op-solicitacoes', 'op-detalhes', 'op-agendamento', 'op-rota', 'op-lotes', 'op-indicadores', 'op-recebimento'];
const COLETOR = ['coletor-inicio', 'coletor-qr', 'coletor-qtd'];
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
  'gerador-dash': 'Gerador Dash', 'gerador-solicitar': 'Solicitar Coleta', 'gerador-minhas': 'Minhas Solicitações',
  'gerador-recipiente': 'Recipiente + QR', 'op-solicitacoes': 'Op. Solicitações', 'op-detalhes': 'Detalhes',
  'op-agendamento': 'Agendamento', 'op-rota': 'Mapa/Rota', 'op-lotes': 'Lotes', 'op-indicadores': 'Indicadores',
  'op-recebimento': 'Recebimento', 'coletor-inicio': 'Coletor Início', 'coletor-qr': 'Ler QR',
  'coletor-qtd': 'Qtd Coletada', 'destino-reg': 'Destino Final',
};

export default function App() {
  const [tela, setTela] = useState('landing');
  const [session, setSession] = useState({ loading: true, user: null, profile: null });
  const [erroPerfil, setErroPerfil] = useState(null);

  useEffect(() => {
    if (!firebaseConfigured) { setSession({ loading: false, user: null, profile: null }); return undefined; }
    return onAuthStateChanged(auth, async (user) => {
      if (!user) { setSession({ loading: false, user: null, profile: null }); return; }
      try {
        const profile = await carregarOuCriarPerfil(user);
        setErroPerfil(null);
        setSession({ loading: false, user, profile });
        setTela((atual) => (atual === 'landing' || atual === 'login' ? (TELA_INICIAL[profile.role] || 'landing') : atual));
      } catch (error) {
        console.error('Não foi possível carregar o perfil:', error);
        setErroPerfil(error?.code === 'permission-denied'
          ? 'O Firestore recusou o acesso ao seu perfil. Confira se as regras (firestore.rules) foram publicadas.'
          : 'Não foi possível carregar seu perfil. Verifique a conexão e a configuração do Firebase.');
        await signOut(auth);
        setSession({ loading: false, user: null, profile: null });
      }
    });
  }, []);

  async function handleLogout() {
    await signOut(auth);
    setTela('landing');
  }

  const role = session.profile?.role;
  const permitidas = TELAS_POR_PERFIL[role] || [];
  const props = { session, onNavigate: setTela };

  function renderTela() {
    if (session.loading) return <div className="m-8 text-gray-300">Carregando…</div>;
    const publica = tela === 'landing' || tela === 'login';
    if (!publica && !session.user) return <Login erroInicial={erroPerfil} />;
    if (!publica && !permitidas.includes(tela)) {
      return <div className="m-8 rounded-lg bg-white p-6 text-gray-800">Seu perfil não tem permissão para acessar esta tela.</div>;
    }
    switch (tela) {
      case 'login': return <Login erroInicial={erroPerfil} />;
      case 'gerador-dash': return <DashboardGerador {...props} />;
      case 'gerador-solicitar': return <SolicitarColeta {...props} />;
      case 'gerador-minhas': return <MinhasSolicitacoes {...props} />;
      case 'gerador-recipiente': return <RecipienteDetalhes {...props} />;
      case 'op-solicitacoes': return <SolicitacoesOperacao {...props} />;
      case 'op-detalhes': return <DetalhesSolicitacao {...props} />;
      case 'op-agendamento': return <Agendamento {...props} />;
      case 'op-rota': return <PlanejamentoRota {...props} />;
      case 'op-lotes': return <Lotes {...props} />;
      case 'op-indicadores': return <Indicadores {...props} />;
      case 'op-recebimento': return <Recebimento {...props} />;
      case 'coletor-inicio': return <ColetorInicio {...props} />;
      case 'coletor-qr': return <LerQRCode {...props} />;
      case 'coletor-qtd': return <RegistrarQuantidade {...props} />;
      case 'destino-reg': return <RegistroDestinacao {...props} />;
      case 'landing': default: return <LandingPage />;
    }
  }

  const botao = (id, rotulo) => (
    <button key={id} onClick={() => setTela(id)}
      className={`px-3 py-1.5 rounded whitespace-nowrap transition-colors ${tela === id ? 'bg-[#C58A32] text-[#0B1726] font-bold' : 'bg-gray-800 hover:bg-gray-700'}`}>
      {rotulo}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <div className="bg-[#0B1726] border-b border-gray-800 text-white px-6 py-3 flex items-center justify-between gap-4 overflow-x-auto text-xs shadow-md z-50">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {botao('landing', 'Início')}
          {!session.user && botao('login', 'Entrar')}
          {permitidas.map((id) => botao(id, ROTULOS[id]))}
        </div>
        {session.user && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-gray-300">{session.user.email} · {role}</span>
            <button onClick={handleLogout} className="px-3 py-1.5 rounded bg-red-900 hover:bg-red-800">Sair</button>
          </div>
        )}
      </div>
      <div className="flex-1">{renderTela()}</div>
    </div>
  );
}
