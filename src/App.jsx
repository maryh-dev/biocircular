import React, { useState } from 'react';

// Importação de todas as telas que criámos
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

export default function App() {
  // Estado para controlar qual tela está a ser exibida no momento
  const [currentScreen, setCurrentScreen] = useState('landing');

  // Mapeamento das telas
  const renderScreen = () => {
    switch (currentScreen) {
      case 'login': return <Login />;
      case 'gerador-dash': return <DashboardGerador />;
      case 'gerador-solicitar': return <SolicitarColeta />;
      case 'gerador-minhas': return <MinhasSolicitacoes />;
      case 'gerador-recipiente': return <RecipienteDetalhes />;
      case 'op-solicitacoes': return <SolicitacoesOperacao />;
      case 'op-detalhes': return <DetalhesSolicitacao />;
      case 'op-agendamento': return <Agendamento />;
      case 'op-rota': return <PlanejamentoRota />;
      case 'op-lotes': return <Lotes />;
      case 'op-indicadores': return <Indicadores />;
      case 'op-recebimento': return <Recebimento />;
      case 'coletor-inicio': return <ColetorInicio />;
      case 'coletor-qr': return <LerQRCode />;
      case 'coletor-qtd': return <RegistrarQuantidade />;
      case 'destino-reg': return <RegistroDestinacao />;
      case 'landing': default: return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Barra de Navegação de Teste (Menu Flutuante Superior) */}
      <div className="bg-[#0B1726] border-b border-gray-800 text-white px-6 py-3 flex items-center justify-between gap-4 overflow-x-auto text-xs shadow-md z-50">
        <div className="flex items-center gap-2 font-bold text-[#C58A32]">
          <span>⚡ MENU DE TESTE (FRONTEND):</span>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button onClick={() => setCurrentScreen('landing')} className={`px-3 py-1.5 rounded transition-colors ${currentScreen === 'landing' ? 'bg-[#C58A32] text-[#0B1726] font-bold' : 'bg-gray-800 hover:bg-gray-700'}`}>Landing Page</button>
          <button onClick={() => setCurrentScreen('login')} className={`px-3 py-1.5 rounded transition-colors ${currentScreen === 'login' ? 'bg-[#C58A32] text-[#0B1726] font-bold' : 'bg-gray-800 hover:bg-gray-700'}`}>1. Login</button>
          
          <span className="text-gray-500">|</span>
          <button onClick={() => setCurrentScreen('gerador-dash')} className={`px-3 py-1.5 rounded transition-colors ${currentScreen === 'gerador-dash' ? 'bg-[#C58A32] text-[#0B1726] font-bold' : 'bg-gray-800 hover:bg-gray-700'}`}>Gerador Dash</button>
          <button onClick={() => setCurrentScreen('gerador-solicitar')} className={`px-3 py-1.5 rounded transition-colors ${currentScreen === 'gerador-solicitar' ? 'bg-[#C58A32] text-[#0B1726] font-bold' : 'bg-gray-800 hover:bg-gray-700'}`}>Solicitar Coleta</button>
          <button onClick={() => setCurrentScreen('gerador-minhas')} className={`px-3 py-1.5 rounded transition-colors ${currentScreen === 'gerador-minhas' ? 'bg-[#C58A32] text-[#0B1726] font-bold' : 'bg-gray-800 hover:bg-gray-700'}`}>Minhas Solis</button>
          <button onClick={() => setCurrentScreen('gerador-recipiente')} className={`px-3 py-1.5 rounded transition-colors ${currentScreen === 'gerador-recipiente' ? 'bg-[#C58A32] text-[#0B1726] font-bold' : 'bg-gray-800 hover:bg-gray-700'}`}>Recipiente + QR</button>

          <span className="text-gray-500">|</span>
          <button onClick={() => setCurrentScreen('op-solicitacoes')} className={`px-3 py-1.5 rounded transition-colors ${currentScreen === 'op-solicitacoes' ? 'bg-[#C58A32] text-[#0B1726] font-bold' : 'bg-gray-800 hover:bg-gray-700'}`}>Op. Solis</button>
          <button onClick={() => setCurrentScreen('op-detalhes')} className={`px-3 py-1.5 rounded transition-colors ${currentScreen === 'op-detalhes' ? 'bg-[#C58A32] text-[#0B1726] font-bold' : 'bg-gray-800 hover:bg-gray-700'}`}>Detalhes Solis</button>
          <button onClick={() => setCurrentScreen('op-agendamento')} className={`px-3 py-1.5 rounded transition-colors ${currentScreen === 'op-agendamento' ? 'bg-[#C58A32] text-[#0B1726] font-bold' : 'bg-gray-800 hover:bg-gray-700'}`}>Agendamento</button>
          <button onClick={() => setCurrentScreen('op-rota')} className={`px-3 py-1.5 rounded transition-colors ${currentScreen === 'op-rota' ? 'bg-[#C58A32] text-[#0B1726] font-bold' : 'bg-gray-800 hover:bg-gray-700'}`}>Mapa/Rota</button>
          <button onClick={() => setCurrentScreen('op-lotes')} className={`px-3 py-1.5 rounded transition-colors ${currentScreen === 'op-lotes' ? 'bg-[#C58A32] text-[#0B1726] font-bold' : 'bg-gray-800 hover:bg-gray-700'}`}>Lotes</button>
          <button onClick={() => setCurrentScreen('op-indicadores')} className={`px-3 py-1.5 rounded transition-colors ${currentScreen === 'op-indicadores' ? 'bg-[#C58A32] text-[#0B1726] font-bold' : 'bg-gray-800 hover:bg-gray-700'}`}>Indicadores</button>
          <button onClick={() => setCurrentScreen('op-recebimento')} className={`px-3 py-1.5 rounded transition-colors ${currentScreen === 'op-recebimento' ? 'bg-[#C58A32] text-[#0B1726] font-bold' : 'bg-gray-800 hover:bg-gray-700'}`}>Recebimento</button>

          <span className="text-gray-500">|</span>
          <button onClick={() => setCurrentScreen('coletor-inicio')} className={`px-3 py-1.5 rounded transition-colors ${currentScreen === 'coletor-inicio' ? 'bg-[#C58A32] text-[#0B1726] font-bold' : 'bg-gray-800 hover:bg-gray-700'}`}>Coletor Início</button>
          <button onClick={() => setCurrentScreen('coletor-qr')} className={`px-3 py-1.5 rounded transition-colors ${currentScreen === 'coletor-qr' ? 'bg-[#C58A32] text-[#0B1726] font-bold' : 'bg-gray-800 hover:bg-gray-700'}`}>Ler QR</button>
          <button onClick={() => setCurrentScreen('coletor-qtd')} className={`px-3 py-1.5 rounded transition-colors ${currentScreen === 'coletor-qtd' ? 'bg-[#C58A32] text-[#0B1726] font-bold' : 'bg-gray-800 hover:bg-gray-700'}`}>Qtd Coletada</button>

          <span className="text-gray-500">|</span>
          <button onClick={() => setCurrentScreen('destino-reg')} className={`px-3 py-1.5 rounded transition-colors ${currentScreen === 'destino-reg' ? 'bg-[#C58A32] text-[#0B1726] font-bold' : 'bg-gray-800 hover:bg-gray-700'}`}>Destino Final</button>
        </div>
      </div>

      {/* Renderização da Tela Selecionada */}
      <div className="flex-1">
        {renderScreen()}
      </div>
    </div>
  );
}