import React, { useCallback, useEffect, useId, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { ArrowLeft, Camera, Keyboard, QrCode } from 'lucide-react';

function CameraQRCode({ onLer }) {
  const identificador = useId().replace(/:/g, '');

  useEffect(() => {
    const leitor = new Html5QrcodeScanner(
      `leitor-qr-${identificador}`,
      { fps: 10, qrbox: { width: 240, height: 240 }, rememberLastUsedCamera: true },
      false
    );
    leitor.render((codigo) => onLer(codigo), () => {});

    return () => {
      leitor.clear().catch((error) => {
        console.error('Não foi possível desligar o leitor de QR Code:', error);
      });
    };
  }, [identificador, onLer]);

  return <div id={`leitor-qr-${identificador}`} className="min-h-64 overflow-hidden rounded-xl bg-slate-950" />;
}

export default function LerQRCode({ coletaAtual, onNavigate, onRecipienteLido }) {
  const [codigoManual, setCodigoManual] = useState('');
  const [erro, setErro] = useState('');
  const [lendo, setLendo] = useState(true);
  const codigoEsperado = String(coletaAtual?.recipienteCodigo || '').trim().toUpperCase();
  const nomeGerador = coletaAtual?.solicitanteNome || 'Gerador';

  const confirmarCodigo = useCallback((codigo) => {
    const normalizado = String(codigo || '').trim().toUpperCase();
    if (!normalizado) {
      setErro('Informe o código exibido no recipiente.');
      return;
    }
    if (normalizado !== codigoEsperado) {
      setErro('Este QR Code não corresponde ao recipiente da coleta selecionada.');
      return;
    }

    setErro('');
    setLendo(false);
    onRecipienteLido?.(normalizado);
  }, [codigoEsperado, onRecipienteLido]);

  if (!coletaAtual) {
    return (
      <main className="mx-auto min-h-[70vh] max-w-2xl px-4 py-10">
        <section className="rounded-2xl border border-bioclube-border bg-white p-6 text-center shadow-sm">
          <QrCode className="mx-auto h-10 w-10 text-amber-700" />
          <h1 className="mt-4 text-xl font-bold">Nenhuma coleta selecionada</h1>
          <p className="mt-2 text-sm text-bioclube-textSub">Abra sua rota e selecione uma parada antes de ler o recipiente.</p>
          <button type="button" onClick={() => onNavigate?.('coletor-inicio')} className="mt-5 rounded-lg bg-bioclube-dark px-4 py-2.5 text-sm font-bold text-white">
            Voltar para minha rota
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bioclube-light px-4 py-6 text-bioclube-textMain sm:px-6 sm:py-10">
      <div className="mx-auto max-w-2xl space-y-5">
        <button type="button" onClick={() => onNavigate?.('coletor-inicio')} className="inline-flex items-center gap-2 text-sm font-semibold text-bioclube-dark">
          <ArrowLeft className="h-4 w-4" /> Voltar para a rota
        </button>
        <section className="rounded-2xl border border-bioclube-border bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><Camera className="h-6 w-6" /></span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Validar recipiente</p>
              <h1 className="mt-1 text-xl font-extrabold">{nomeGerador}</h1>
              <p className="mt-1 text-sm text-bioclube-textSub">{coletaAtual.endereco}</p>
            </div>
          </div>
          <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm">
            <span className="text-xs text-bioclube-textSub">Código esperado</span>
            <strong className="mt-1 block font-mono text-base">{codigoEsperado || 'Não informado'}</strong>
          </div>

          {lendo && codigoEsperado && (
            <div className="mt-5">
              <p className="mb-3 text-sm font-semibold">Aponte a câmera para o QR Code</p>
              <CameraQRCode onLer={confirmarCodigo} />
              <p className="mt-2 text-xs leading-5 text-bioclube-textSub">
                A câmera exige permissão do navegador e conexão segura (HTTPS ou localhost). Se não abrir, confira a permissão ou digite o código.
              </p>
            </div>
          )}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              confirmarCodigo(codigoManual);
            }}
            className="mt-5 border-t border-bioclube-border pt-5"
          >
            <label htmlFor="codigo-manual" className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <Keyboard className="h-4 w-4" /> Digitar código manualmente
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                id="codigo-manual"
                value={codigoManual}
                onChange={(event) => setCodigoManual(event.target.value.toUpperCase())}
                placeholder="Ex.: REC-00482"
                className="min-w-0 flex-1 rounded-lg border border-bioclube-border px-3 py-2.5 font-mono text-sm uppercase"
              />
              <button type="submit" className="rounded-lg bg-bioclube-dark px-4 py-2.5 text-sm font-bold text-white">
                Validar recipiente
              </button>
            </div>
          </form>
          {erro && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{erro}</p>}
        </section>
      </div>
    </main>
  );
}
