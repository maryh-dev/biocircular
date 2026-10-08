import React, { useState } from 'react';
import AppShell from './components/AppShell';
import OperationShell from './components/OperationShell';
import { NavigationProvider } from './components/NavigationContext';

// Importação de todas as telas que criámos
import Login from './pages/Login/Login';
import DashboardGerador from './pages/Gerador/DashboardGerador';
import SolicitarColeta from './pages/Gerador/SolicitarColeta';
import MinhasSolicitacoes from './pages/Gerador/MinhasSolicitacoes';
import RecipienteDetalhes from './pages/Gerador/RecipienteDetalhes';
import SolicitacoesOperacao from './pages/Operacao/SolicitacoesOperacao';
import DashboardOperacao from './pages/Operacao/DashboardOperacao';
import DetalhesSolicitacao from './pages/Operacao/DetalhesSolicitacao';
import Agendamento from './pages/Operacao/Agendamento';
import PlanejamentoRota from './pages/Operacao/PlanejamentoRota';
import Lotes from './pages/Operacao/Lotes';
import Indicadores from './pages/Operacao/Indicadores';
import Recebimento from './pages/Operacao/Recebimento';
import ColetorInicio from './pages/Coletor/ColetorInicio';
import LerQRCode from './pages/Coletor/LerQRCode';
import RegistrarQuantidade from './pages/Coletor/RegistrarQuantidade';
import ColetaConcluida from './pages/Coletor/ColetaConcluida';
import RegistroDestinacao from './pages/Destino/RegistroDestinacao';
import LandingPage from './pages/Landing/LandingPage';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('landing');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login': return <Login />;
      case 'gerador-dash': return <AppShell currentScreen={currentScreen} onNavigate={setCurrentScreen}><DashboardGerador /></AppShell>;
      case 'gerador-solicitar': return <AppShell currentScreen={currentScreen} onNavigate={setCurrentScreen}><SolicitarColeta /></AppShell>;
      case 'gerador-minhas': return <AppShell currentScreen={currentScreen} onNavigate={setCurrentScreen}><MinhasSolicitacoes /></AppShell>;
      case 'gerador-recipiente': return <AppShell currentScreen={currentScreen} onNavigate={setCurrentScreen}><RecipienteDetalhes /></AppShell>;
      case 'op-solicitacoes': return <OperationShell currentScreen={currentScreen} onNavigate={setCurrentScreen}><SolicitacoesOperacao /></OperationShell>;
      case 'op-dashboard': return <OperationShell currentScreen={currentScreen} onNavigate={setCurrentScreen}><DashboardOperacao /></OperationShell>;
      case 'op-detalhes': return <OperationShell currentScreen={currentScreen} onNavigate={setCurrentScreen}><DetalhesSolicitacao /></OperationShell>;
      case 'op-agendamento': return <OperationShell currentScreen={currentScreen} onNavigate={setCurrentScreen}><Agendamento /></OperationShell>;
      case 'op-rota': return <OperationShell currentScreen={currentScreen} onNavigate={setCurrentScreen}><PlanejamentoRota /></OperationShell>;
      case 'op-lotes': return <OperationShell currentScreen={currentScreen} onNavigate={setCurrentScreen}><Lotes /></OperationShell>;
      case 'op-indicadores': return <OperationShell currentScreen={currentScreen} onNavigate={setCurrentScreen}><Indicadores /></OperationShell>;
      case 'op-recebimento': return <OperationShell currentScreen={currentScreen} onNavigate={setCurrentScreen}><Recebimento /></OperationShell>;
      case 'coletor-inicio': return <ColetorInicio />;
      case 'coletor-qr': return <LerQRCode />;
      case 'coletor-qtd': return <RegistrarQuantidade />;
      case 'coletor-concluida': return <ColetaConcluida />;
      case 'destino-reg': return <OperationShell currentScreen={currentScreen} onNavigate={setCurrentScreen}><RegistroDestinacao /></OperationShell>;
      case 'landing': default: return <LandingPage onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <NavigationProvider navigate={setCurrentScreen}>
      <div className="min-h-screen">
        {renderScreen()}
      </div>
    </NavigationProvider>
  );
}