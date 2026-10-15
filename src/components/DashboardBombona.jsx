import React, { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { Droplets } from 'lucide-react';
import { database } from '../services/firebase.js';

function numeroFormatado(valor, casas) {
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero.toFixed(casas) : (0).toFixed(casas);
}

function dataFormatada(valor) {
  if (!valor) return 'Sem atualização registrada';

  const data = new Date(valor);
  return Number.isNaN(data.getTime())
    ? 'Data indisponível'
    : data.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

function estadoDoNivel(nivel) {
  if (nivel >= 90) return 'Crítico';
  if (nivel >= 75) return 'Atenção';
  return 'Normal';
}

function BombonaCard({ codigo, dados }) {
  const nivel = Math.min(100, Math.max(0, Number(dados.nivel_ultrassom) || 0));
  const estado = estadoDoNivel(nivel);
  const estadoClasse = {
    Normal: 'bg-emerald-100 text-emerald-800',
    Atenção: 'bg-amber-100 text-amber-900',
    'Crítico': 'bg-red-100 text-red-800',
  }[estado];
  const capacidade = Number(dados.capacidade_litros) || 0;

  return (
    <article className="rounded-2xl border border-bioclube-border bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-700">Monitoramento</p>
          <h3 className="mt-1 text-lg font-bold">Bombona {codigo}</h3>
        </div>
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${estadoClasse}`}>
          <Droplets className="h-3.5 w-3.5" />
          {estado}
        </span>
      </div>

      <div className="mt-5 flex flex-col items-center rounded-2xl border border-bioclube-border bg-bioclube-light p-5 sm:p-7">
        <div className="relative h-64 w-36" aria-label={`Bombona ${codigo}, ${estado}, nível de ${nivel.toFixed(1)}%`} role="img">
          <div className="absolute inset-0 overflow-hidden rounded-[1.8rem] border-2 border-slate-500 bg-white">
            {[25, 50, 75].map((marca) => (
              <div key={marca} className="absolute inset-x-0 border-t border-slate-200" style={{ bottom: `${marca}%` }} />
            ))}
            <div
              className="absolute inset-x-0 bottom-0"
              style={{ height: `${nivel}%`, backgroundColor: 'var(--color-bioclube-amber, #f2a900)' }}
            >
              <div className="absolute -top-2 left-0 h-4 w-full rounded-[50%] bg-amber-300/90" />
            </div>
          </div>
        </div>

        <strong className="mt-4 text-5xl font-black tracking-tight text-bioclube-textMain">{nivel.toFixed(0)}%</strong>
        <span className="mt-1 text-sm text-bioclube-textSub">
          {numeroFormatado(dados.litros_ultrassom, 0)} L de {numeroFormatado(capacidade, 0)} L
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs text-bioclube-textSub">Status</p>
          <p className="mt-2 text-base font-bold text-bioclube-textMain">{estado}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs text-bioclube-textSub">Nível ultrassônico</p>
          <p className="mt-2 text-2xl font-bold text-bioclube-textMain">{numeroFormatado(dados.nivel_ultrassom, 1)}%</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs text-bioclube-textSub">Volume estimado</p>
          <p className="mt-2 text-2xl font-bold text-bioclube-textMain">{numeroFormatado(dados.litros_ultrassom, 1)} L</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-bioclube-border px-4 py-3 text-xs">
        <span className="text-bioclube-textSub">Peso lido</span>
        <strong>{numeroFormatado(dados.peso_kg, 2)} kg</strong>
      </div>
      <p className="mt-4 text-[11px] text-bioclube-textSub">
        Última atualização: {dataFormatada(dados.ultima_atualizacao)}
      </p>
    </article>
  );
}

export default function DashboardBombona({ bombonasCadastradas = [] }) {
  const [dadosBombonas, setDadosBombonas] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (!database) {
      setCarregando(false);
      return undefined;
    }

    const bombonasRef = ref(database, 'bombonas');
    const unsubscribe = onValue(
      bombonasRef,
      (snapshot) => {
        setDadosBombonas(snapshot.exists() ? snapshot.val() : {});
        setErro(null);
        setCarregando(false);
      },
      (error) => {
        console.error('Erro ao ler dados das bombonas:', error);
        setErro('Não foi possível carregar os dados em tempo real.');
        setCarregando(false);
      }
    );

    return unsubscribe;
  }, []);

  const bombonas = bombonasCadastradas
    .map((codigo) => [codigo, dadosBombonas[codigo]])
    .sort(([codigoA], [codigoB]) => codigoA.localeCompare(codigoB));
  const bombonasConectadas = bombonas.filter(([, dados]) => dados && typeof dados === 'object');

  return (
    <section>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-700">Monitoramento</p>
          <h2 className="mt-1 text-lg font-bold">Bombonas conectadas</h2>
          <p className="mt-1 text-xs text-bioclube-textSub">Acompanhamento em tempo real de todas as bombonas cadastradas.</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-emerald-800">
          {bombonas.length} {bombonas.length === 1 ? 'cadastrada' : 'cadastradas'}
        </span>
      </div>

      {carregando && (
        <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-bioclube-textSub">Carregando bombonas...</p>
      )}

      {!carregando && !database && (
        <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          Configure `VITE_FIREBASE_DATABASE_URL` no `.env.local` para conectar o monitoramento.
        </p>
      )}

      {!carregando && erro && (
        <p className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-800">{erro}</p>
      )}

      {!carregando && !erro && database && bombonas.length === 0 && (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          <strong>Cadastre uma bombona para iniciar o monitoramento.</strong>
          <p className="mt-1">Depois do cadastro, o painel buscará os dados do dispositivo correspondente no Wokwi.</p>
        </div>
      )}

      {!carregando && !erro && bombonas.length > 0 && bombonasConectadas.length === 0 && (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          <strong>Bombona cadastrada, aguardando conexão.</strong>
          <p className="mt-1">Inicie o Wokwi com o mesmo código cadastrado para receber os dados.</p>
          <p className="mt-3 font-mono text-xs">{bombonas.map(([codigo]) => codigo).join(' · ')}</p>
        </div>
      )}

      {!carregando && !erro && bombonasConectadas.length > 0 && (
        <div className="mt-5 grid gap-6 xl:grid-cols-2">
          {bombonasConectadas.map(([codigo, dados]) => (
            <BombonaCard key={codigo} codigo={codigo} dados={dados} />
          ))}
        </div>
      )}
    </section>
  );
}
