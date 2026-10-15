import React, { useMemo, useRef, useState } from 'react';
import { Activity, Download, MapPin, Plus, QrCode, ShieldCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import DashboardBombona from '../../components/DashboardBombona.jsx';

const MODELOS_PADRAO = [
  'Bombona 200 L',
  'Bombona 300 L',
  'Tambor 60 L',
  'Container 500 L',
  'Balde industrial 120 L',
];

const STATUS_PADRAO = ['Ativo', 'Em manutenção', 'Inativo'];
const BOMBONAS_DISPONIVEIS = ['BOM-001', 'BOM-002', 'BOM-003'];

export default function RecipienteDetalhes({ onNavigate }) {
  const qrRef = useRef(null);
  const [listaRecipientes, setListaRecipientes] = useState([]);

  const [forma, setForma] = useState({
    codigo: '',
    modelo: MODELOS_PADRAO[0],
    capacidade: 200,
    local: '',
    status: 'Ativo',
    observacoes: '',
  });
  const [abaAtiva, setAbaAtiva] = useState('cadastro');
  const [codigoSelecionado, setCodigoSelecionado] = useState(null);
  const [erroCadastro, setErroCadastro] = useState(null);

  const codigoAtual = useMemo(
    () => forma.codigo || codigoSelecionado || 'BOM-001',
    [forma.codigo, codigoSelecionado]
  );

  function baixarEtiqueta() {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    const arquivo = new Blob(
      [new XMLSerializer().serializeToString(svg)],
      { type: 'image/svg+xml;charset=utf-8' }
    );
    const url = URL.createObjectURL(arquivo);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${codigoAtual}.svg`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!forma.codigo) {
      setErroCadastro('Selecione uma bombona antes de cadastrar.');
      return;
    }

    const proximoRecipiente = {
      codigo: forma.codigo,
      modelo: forma.modelo,
      capacidade: Number(forma.capacidade) || 0,
      local: forma.local || 'Local não informado',
      status: forma.status,
      observacoes: forma.observacoes || 'Sem observações',
    };

    if (listaRecipientes.some((recipiente) => recipiente.codigo === proximoRecipiente.codigo)) {
      setErroCadastro('Essa bombona já está cadastrada. Informe outro código.');
      return;
    }

    setListaRecipientes((atual) => [proximoRecipiente, ...atual]);
    setCodigoSelecionado(proximoRecipiente.codigo);
    setErroCadastro(null);
    setForma({
      codigo: '',
      modelo: MODELOS_PADRAO[0],
      capacidade: 200,
      local: '',
      status: 'Ativo',
      observacoes: '',
    });
    setAbaAtiva('qrcode');
  }

  return (
    <div className="min-h-screen bg-bioclube-light font-sans text-bioclube-textMain">
      <div className="p-4 md:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Bombonas</h1>
              <p className="text-xs text-bioclube-textSub mt-1">Cadastre bombonas, gere etiquetas e acompanhe o monitoramento.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-b border-bioclube-border pb-3" role="tablist" aria-label="Seções de bombonas">
            {[
              { id: 'cadastro', label: 'Cadastro', Icon: Plus },
              { id: 'qrcode', label: 'QR Code', Icon: QrCode },
              { id: 'monitoramento', label: 'Monitoramento', Icon: Activity },
            ].map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={abaAtiva === id}
                onClick={() => setAbaAtiva(id)}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition ${
                  abaAtiva === id
                    ? 'bg-bioclube-dark text-white'
                    : 'text-bioclube-textSub hover:bg-white hover:text-bioclube-textMain'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          <div>
          {abaAtiva === 'cadastro' && (
            <>
            <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-bioclube-border bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-700">Nova bombona</p>
                  <h2 className="mt-1 text-lg font-bold">Identificação</h2>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-800">
                  <ShieldCheck className="h-3.5 w-3.5" /> Local somente
                </span>
              </div>

              <div>
                <label htmlFor="codigo-bombona" className="mb-1.5 block text-sm font-semibold">Bombona disponível</label>
                <select
                  id="codigo-bombona"
                  value={forma.codigo}
                  onChange={(event) => {
                    setErroCadastro(null);
                    setForma((atual) => ({ ...atual, codigo: event.target.value }));
                  }}
                  className="w-full rounded-xl border border-bioclube-border bg-white px-3 py-2.5 text-sm"
                >
                  <option value="">Selecione uma bombona</option>
                  {BOMBONAS_DISPONIVEIS
                    .filter((codigo) => !listaRecipientes.some((item) => item.codigo === codigo))
                    .map((codigo) => <option key={codigo} value={codigo}>{codigo}</option>)}
                </select>
                <p className="mt-2 text-[11px] text-bioclube-textSub">Ao cadastrar, o monitoramento passa a buscar os dados deste dispositivo.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="modelo-rec" className="mb-1.5 block text-sm font-semibold">Modelo padronizado</label>
                  <select
                    id="modelo-rec"
                    value={forma.modelo}
                    onChange={(event) => setForma((atual) => ({ ...atual, modelo: event.target.value }))}
                    className="w-full rounded-xl border border-bioclube-border bg-white px-3 py-2.5 text-sm"
                  >
                    {MODELOS_PADRAO.map((modelo) => <option key={modelo} value={modelo}>{modelo}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor="capacidade-rec" className="mb-1.5 block text-sm font-semibold">Capacidade (L)</label>
                  <input
                    id="capacidade-rec"
                    type="number"
                    min="1"
                    step="1"
                    value={forma.capacidade}
                    onChange={(event) => setForma((atual) => ({ ...atual, capacidade: Number(event.target.value || 0) }))}
                    className="w-full rounded-xl border border-bioclube-border px-3 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="local-rec" className="mb-1.5 block text-sm font-semibold">Local de instalação</label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="local-rec"
                    value={forma.local}
                    onChange={(event) => setForma((atual) => ({ ...atual, local: event.target.value }))}
                    placeholder="Ex.: Cozinha · doca lateral"
                    className="w-full rounded-xl border border-bioclube-border bg-white py-2.5 pl-9 pr-3 text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="status-rec" className="mb-1.5 block text-sm font-semibold">Status</label>
                <select
                  id="status-rec"
                  value={forma.status}
                  onChange={(event) => setForma((atual) => ({ ...atual, status: event.target.value }))}
                  className="w-full rounded-xl border border-bioclube-border bg-white px-3 py-2.5 text-sm"
                >
                  {STATUS_PADRAO.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="obs-rec" className="mb-1.5 block text-sm font-semibold">Observações</label>
                <textarea
                  id="obs-rec"
                  rows="3"
                  value={forma.observacoes}
                  onChange={(event) => setForma((atual) => ({ ...atual, observacoes: event.target.value }))}
                  placeholder="Ex.: Requer inspeção mensal, uso operacional, etc."
                  className="w-full rounded-xl border border-bioclube-border px-3 py-2.5 text-sm"
                />
              </div>

              <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-bioclube-dark px-4 py-3 text-sm font-bold text-white">
                <Plus className="h-4 w-4" /> Cadastrar bombona
              </button>
              {erroCadastro && (
                <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{erroCadastro}</p>
              )}
            </form>

            <div className="mt-6 rounded-2xl border border-bioclube-border bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-700">Bombonas do gerador</p>
                  <h2 className="mt-1 text-lg font-bold">{listaRecipientes.length} cadastrada{listaRecipientes.length === 1 ? '' : 's'}</h2>
                </div>
                <span className="text-xs text-bioclube-textSub">Prontas para identificação</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {listaRecipientes.map((recipiente) => (
                  <button
                    key={recipiente.codigo}
                    type="button"
                    onClick={() => {
                      setCodigoSelecionado(recipiente.codigo);
                      setAbaAtiva('qrcode');
                    }}
                    className="rounded-xl border border-bioclube-border p-3 text-left transition hover:border-bioclube-amber hover:bg-amber-50"
                  >
                    <strong className="font-mono text-sm">{recipiente.codigo}</strong>
                    <span className="mt-1 block text-xs text-bioclube-textSub">{recipiente.modelo} · {recipiente.capacidade} L</span>
                  </button>
                ))}
              </div>
            </div>
            </>
          )}

          {abaAtiva === 'qrcode' && (
              <div className="mx-auto max-w-2xl rounded-2xl border border-bioclube-border bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-700">Pré-visualização</p>
                    <h3 className="mt-1 text-lg font-bold">QR Code gerado</h3>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    forma.status === 'Ativo' ? 'bg-emerald-50 text-emerald-800' :
                    forma.status === 'Em manutenção' ? 'bg-amber-50 text-amber-800' : 'bg-slate-100 text-slate-800'
                  }`}>{forma.status}</span>
                </div>

                <div ref={qrRef} className="mt-5 flex items-center justify-center rounded-2xl border border-gray-200 bg-white p-4">
                  <QRCodeSVG value={codigoAtual} size={200} level="M" title={`QR Code do recipiente ${codigoAtual}`} />
                </div>

                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-bioclube-textSub">Código</p>
                  <p className="mt-1 font-mono text-base font-semibold">{codigoAtual}</p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <span className="block text-bioclube-textSub">Modelo</span>
                    <strong className="mt-1 block">{forma.modelo}</strong>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <span className="block text-bioclube-textSub">Capacidade</span>
                    <strong className="mt-1 block">{forma.capacidade || 0} L</strong>
                  </div>
                </div>

                <button type="button" onClick={baixarEtiqueta} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-bioclube-border bg-white px-4 py-3 text-sm font-bold text-bioclube-dark">
                  <Download className="h-4 w-4" /> Baixar QR Code
                </button>
              </div>
          )}

          {abaAtiva === 'monitoramento' && (
            <DashboardBombona bombonasCadastradas={listaRecipientes.map(({ codigo }) => codigo)} />
          )}
          </div>
        </div>
    </div>
  );
}