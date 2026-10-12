import React, { useCallback, useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  Keyboard,
  QrCode,
  RefreshCcw,
} from 'lucide-react';

function CameraQRCode({ onLer, onError, retryToken }) {
  useEffect(() => {
    let cancelled = false;
    let scanner = null;

    const montarScanner = () => {
      const container = document.getElementById('leitor-qr-coletor');
      if (!container) return;

      container.innerHTML = '';
      scanner = new Html5QrcodeScanner(
        'leitor-qr-coletor',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          rememberLastUsedCamera: true,
          showTorchButtonIfSupported: true,
          aspectRatio: 1,
          disableFlip: false,
          videoConstraints: {
            facingMode: { ideal: 'environment' },
          },
        },
        false
      );

      scanner.render(
        (codigo) => {
          if (!cancelled) onLer(codigo);
        },
        (erroLeitura) => {
          if (!cancelled) {
            const mensagem = String(erroLeitura || '').toLowerCase();
            if (!mensagem.includes('not found') && !mensagem.includes('no qr code')) {
              console.warn('Leitura QR falhou:', erroLeitura);
            }
          }
        }
      );
    };

    try {
      montarScanner();
    } catch (error) {
      if (!cancelled) {
        console.error('Não foi possível iniciar o leitor de QR:', error);
        onError?.('Não foi possível abrir a câmera do dispositivo. Verifique a permissão e tente novamente.');
      }
    }

    return () => {
      cancelled = true;
      if (scanner) {
        scanner.clear().catch((error) => {
          console.warn('Não foi possível encerrar o leitor de QR:', error);
        });
      }
    };
  }, [onError, onLer, retryToken]);

  return <div id="leitor-qr-coletor" className="min-h-64 overflow-hidden rounded-xl bg-slate-950" />;
}

export default function LerQRCode({ coletaAtual, onNavigate, onRecipienteLido }) {
  const [codigoManual, setCodigoManual] = useState('');
  const [erro, setErro] = useState('');
  const [status, setStatus] = useState('idle');
  const [retryToken, setRetryToken] = useState(0);
  const codigoEsperado = String(coletaAtual?.recipienteCodigo || '').trim().toUpperCase();
  const nomeGerador = coletaAtual?.solicitanteNome || 'Gerador';

  const confirmarCodigo = useCallback((codigo) => {
    const normalizado = String(codigo || '').trim().toUpperCase();
    if (!normalizado) {
      setErro('Informe o código exibido no recipiente.');
      setStatus('error');
      return;
    }
    if (normalizado !== codigoEsperado) {
      setErro('Este QR Code não corresponde ao recipiente da coleta selecionada. Confira o código do recipiente da parada atual.');
      setStatus('error');
      return;
    }

    setErro('');
    setStatus('success');
    onRecipienteLido?.(normalizado);
  }, [codigoEsperado, onRecipienteLido]);

  const repetirLeitura = useCallback(() => {
    setErro('');
    setStatus('idle');
    setRetryToken((valor) => valor + 1);
  }, []);

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

          {status !== 'success' && codigoEsperado && (
            <div className="mt-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">Aponte a câmera para o QR Code</p>
                <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-800">
                  traseira preferida
                </span>
              </div>

              <CameraQRCode
                onLer={confirmarCodigo}
                onError={(mensagem) => {
                  setErro(mensagem);
                  setStatus('error');
                }}
                retryToken={retryToken}
              />

              <p className="mt-2 text-xs leading-5 text-bioclube-textSub">
                A câmera será aberta em modo traseiro quando disponível. Se a leitura não funcionar, use o campo abaixo para digitar o código ou tente novamente.
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

          {erro && (
            <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <div className="flex-1">
                  <p>{erro}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={repetirLeitura}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-700"
                    >
                      <RefreshCcw className="h-3.5 w-3.5" /> Tentar novamente
                    </button>
                    <button
                      type="button"
                      onClick={() => setCodigoManual(codigoEsperado)}
                      className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-700"
                    >
                      Usar código esperado
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Recipiente validado com sucesso. Continuando a coleta.</span>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
