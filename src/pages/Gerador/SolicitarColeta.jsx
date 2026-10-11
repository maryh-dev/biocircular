import React, { useState } from 'react';
import { AlertCircle, ArrowRight, Bell, LocateFixed, Search } from 'lucide-react';
import { criarSolicitacao } from '../../services/db.js';
import MapPicker from '../../components/MapPicker.jsx';

const JANELAS = ['08:00–09:00', '09:00–10:00', '10:00–11:00', '11:00–12:00', '14:00–15:00', '15:00–16:00', '16:00–17:00'];

export default function SolicitarColeta({ session, onNavigate }) {
  const [dataPreferencial, setDataPreferencial] = useState('');
  const [janela, setJanela] = useState(JANELAS[2]);
  const [endereco, setEndereco] = useState('');
  const [recipienteCodigo, setRecipienteCodigo] = useState('');
  const [coordenadas, setCoordenadas] = useState(null);
  const [centroMapa, setCentroMapa] = useState([-23.5505, -46.6333]);
  const [localizando, setLocalizando] = useState(false);
  const [volumeLitros, setVolumeLitros] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const nome = session?.profile?.nome || 'Gerador';
  const sigla = nome.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

  function usarLocalizacaoAtual() {
    if (!navigator.geolocation) {
      setErro('Este navegador não oferece geolocalização. Marque o ponto de coleta no mapa.');
      return;
    }

    setErro(null);
    setLocalizando(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const local = [coords.latitude, coords.longitude];
        setCoordenadas(local);
        setCentroMapa(local);
        setLocalizando(false);
      },
      (error) => {
        console.error('Não foi possível obter a localização:', error);
        setErro(error.code === error.PERMISSION_DENIED
          ? 'Permita a localização no navegador ou marque o endereço diretamente no mapa.'
          : 'Não foi possível obter sua localização. Marque o endereço diretamente no mapa.');
        setLocalizando(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  }

  async function enviar(event) {
    event.preventDefault();
    setErro(null);

    if (!coordenadas) {
      setErro('Marque o ponto exato da coleta no mapa antes de enviar.');
      return;
    }

    setEnviando(true);
    try {
      await criarSolicitacao(session.user, session.profile, {
        dataPreferencial,
        janela,
        endereco,
        recipienteCodigo: recipienteCodigo.trim().toUpperCase(),
        latitude: coordenadas[0],
        longitude: coordenadas[1],
        volumeLitros,
        observacoes,
      });
      onNavigate?.('gerador-minhas');
    } catch (e) {
      console.error(e);
      setErro(e?.code === 'permission-denied'
        ? 'O Firestore recusou a solicitação. Confirme que o perfil está como "gerador" e publique as regras atuais de firestore.rules.'
        : e?.code === 'unavailable' || e?.code === 'network-request-failed'
        ? 'Sem conexão com o Firestore. Confira sua internet e tente novamente.'
        : 'Não foi possível enviar a solicitação. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-bioclube-light font-sans text-bioclube-textMain">
      <aside className="hidden lg:flex lg:w-64 flex-shrink-0 bg-bioclube-dark text-white flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-2 mb-10">
            <span className="bg-bioclube-amber text-bioclube-dark font-bold px-2 py-0.5 rounded text-xs">BC</span>
            <span className="font-bold tracking-wider text-sm">BIOCIRCULAR</span>
          </div>
          <div className="bg-bioclube-secondary p-3 rounded-lg mb-6 border border-gray-800">
            <div className="text-xs font-bold text-bioclube-amber">{sigla}</div>
            <div className="text-sm font-bold">{nome}</div>
            <div className="text-[10px] text-gray-400">Gerador</div>
          </div>
          <nav className="space-y-1">
            <button type="button" onClick={() => onNavigate?.('gerador-dash')} className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white text-sm font-medium">Dashboard</button>
            <button type="button" onClick={() => onNavigate?.('gerador-minhas')} className="flex items-center gap-3 px-3 py-2.5 bg-bioclube-secondary rounded-md text-sm font-medium border-l-4 border-bioclube-amber">Solicitações</button>
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-bioclube-border px-4 md:px-8 flex items-center justify-between">
          <span className="text-xs text-bioclube-textSub">BIOCIRCULAR / <strong className="text-bioclube-textMain">Solicitações</strong></span>
          <div className="flex items-center gap-4"><Search className="w-4 h-4 text-gray-400" /><Bell className="w-4 h-4 text-gray-400" /></div>
        </header>

        <div className="p-4 md:p-8 space-y-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Solicitar coleta</h1>
            <p className="text-xs text-bioclube-textSub mt-1">Informe o recipiente e escolha a melhor janela para retirada.</p>
          </div>

          <form onSubmit={enviar} className="bg-white p-4 md:p-8 rounded-xl border border-bioclube-border shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b pb-4 text-xs font-semibold">
                <span className="w-6 h-6 rounded-full bg-bioclube-dark text-white flex items-center justify-center">1</span> Recipiente
                <span className="text-gray-300">——</span>
                <span className="w-6 h-6 rounded-full bg-bioclube-amber text-bioclube-dark flex items-center justify-center">2</span> Data e janela
                <span className="text-gray-300">——</span>
                <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">3</span> Revisão
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Data preferencial</label>
                  <input type="date" required value={dataPreferencial} onChange={(e) => setDataPreferencial(e.target.value)} className="w-full p-3 border border-bioclube-border rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Janela de horário</label>
                  <select value={janela} onChange={(e) => setJanela(e.target.value)} className="w-full p-3 border border-bioclube-border rounded-md text-sm bg-white">
                    {JANELAS.map((j) => <option key={j}>{j}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Endereço</label>
                <input type="text" required value={endereco} onChange={(e) => setEndereco(e.target.value)} placeholder="Rua, número, cidade" className="w-full p-3 border border-bioclube-border rounded-md text-sm" />
              </div>

              <div>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="block text-xs font-semibold">Ponto de coleta no mapa</span>
                    <p className="mt-1 text-[11px] text-bioclube-textSub">Use sua localização como referência ou arraste o marcador até o endereço.</p>
                  </div>
                  <button
                    type="button"
                    onClick={usarLocalizacaoAtual}
                    disabled={localizando}
                    className="inline-flex items-center gap-2 rounded-lg border border-bioclube-border px-3 py-2 text-xs font-semibold text-bioclube-dark transition hover:bg-slate-50 disabled:opacity-60"
                  >
                    <LocateFixed aria-hidden="true" className="h-4 w-4" />
                    {localizando ? 'Localizando…' : 'Usar minha localização'}
                  </button>
                </div>
                <MapPicker
                  center={centroMapa}
                  position={coordenadas}
                  onPositionChange={setCoordenadas}
                  className="h-64"
                />
                {coordenadas ? (
                  <p id="ponto-coleta" className="mt-2 text-[11px] text-bioclube-textSub">
                    Ponto selecionado: {coordenadas[0].toFixed(5)}, {coordenadas[1].toFixed(5)}
                  </p>
                ) : (
                  <p id="ponto-coleta" className="mt-2 text-[11px] font-medium text-amber-800">
                    Clique no mapa para marcar o ponto. Sem o marcador, não será possível incluir a coleta numa rota.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="codigo-recipiente" className="mb-1 block text-xs font-semibold">Código do recipiente</label>
                <input
                  id="codigo-recipiente"
                  type="text"
                  required
                  value={recipienteCodigo}
                  onChange={(event) => setRecipienteCodigo(event.target.value.toUpperCase())}
                  placeholder="Ex.: REC-00482"
                  pattern="REC-[A-Z0-9-]+"
                  title="Use o código impresso no QR Code, por exemplo REC-00482."
                  className="w-full rounded-md border border-bioclube-border p-3 text-sm uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Volume estimado (litros)</label>
                <input type="number" min="1" required value={volumeLitros} onChange={(e) => setVolumeLitros(e.target.value)} placeholder="Ex.: 180" className="w-full p-3 border border-bioclube-border rounded-md text-sm" />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Observações para o coletor</label>
                <input type="text" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} placeholder="Ex.: acesso pela entrada lateral" className="w-full p-3 border border-bioclube-border rounded-md text-sm" />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>A disponibilidade final será confirmada pela operação.</span>
              </div>

              {erro && <p role="alert" className="text-sm rounded-md p-3 bg-red-50 text-red-700">{erro}</p>}

              <div className="flex justify-between pt-4 border-t">
                <button type="button" onClick={() => onNavigate?.('gerador-minhas')} className="px-5 py-2.5 border border-bioclube-border rounded-md text-xs font-bold">Voltar</button>
                <button type="submit" disabled={enviando} className="px-6 py-2.5 bg-bioclube-dark text-white rounded-md text-xs font-bold flex items-center gap-2 disabled:opacity-60">{enviando ? 'Enviando…' : 'Enviar solicitação'} <ArrowRight className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Resumo Lateral */}
            <div className="bg-gray-50 p-6 rounded-xl border border-bioclube-border space-y-4">
              <h3 className="font-bold text-sm">Resumo</h3>
              <div className="text-xs space-y-3">
                <div><span className="text-bioclube-textSub block">GERADOR</span><strong>{nome}</strong></div>
                <div><span className="text-bioclube-textSub block">VOLUME ESTIMADO</span><strong className="text-base text-bioclube-amber">{volumeLitros ? `${volumeLitros} L` : '—'}</strong></div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}