import React, { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Check,
  CircleUserRound,
  ClipboardList,
  Cpu,
  Menu,
  QrCode,
  Route,
  ShieldCheck,
  Truck,
  X,
  Building2,
  Recycle,
  FileCheck2,
} from 'lucide-react';

import heroImage from '../../assets/hero.png';

const steps = [
  ['01', 'Cadastro', 'Geradores, unidades e recipientes organizados.', ClipboardList],
  ['02', 'Identificação por QR Code', 'Cada recipiente recebe uma identidade única.', QrCode],
  ['03', 'Solicitação e rota', 'Janelas, volumes e localização organizados.', Route],
  ['04', 'Coleta e lote', 'Quantidade e responsáveis registrados.', Truck],
  ['05', 'Destinação final', 'Histórico operacional até o destino.', CircleUserRound],
];

const features = [
  [
    'Rastreabilidade operacional',
    'PASSAPORTE CIRCULAR',
    'Conecte identificação, coleta, lote e destinação em um histórico operacional organizado.',
    ShieldCheck,
    ['Eventos vinculados à origem', 'Responsabilidades e estados visíveis', 'Informações para consulta'],
  ],
  [
    'Organização logística',
    'GESTÃO DE OPERAÇÕES',
    'Reúna solicitações, volumes, janelas e localização para apoiar o planejamento das coletas.',
    Cpu,
    ['Contexto territorial organizado', 'Informações para planejar rotas', 'Acompanhamento das coletas'],
  ],
  [
    'Dados para gestão',
    'RELATÓRIOS OPERACIONAIS',
    'Utilize os registros da operação para apoiar o acompanhamento e a tomada de decisão.',
    BarChart3,
    ['Histórico por gerador e período', 'Dados operacionais organizados', 'Registros de destinação'],
  ],
];

const ecosystem = [
  {
    icon: Building2,
    title: 'Geradores',
    description: 'Organização das unidades geradoras e dos recipientes.',
  },
  {
    icon: Truck,
    title: 'Coletas',
    description: 'Acompanhamento das solicitações e etapas operacionais.',
  },
  {
    icon: Recycle,
    title: 'Destinação',
    description: 'Continuidade do histórico até a etapa de destinação.',
  },
  {
    icon: FileCheck2,
    title: 'Registros',
    description: 'Informações organizadas para consulta e gestão.',
  },
];

function Eyebrow({ children, light = false }) {
  return (
    <p
      className={`flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] ${
        light ? 'text-[#E2AD59]' : 'text-[#A96F1D]'
      }`}
    >
      <span className={`h-px w-7 ${light ? 'bg-[#E2AD59]' : 'bg-[#A96F1D]'}`} />
      {children}
    </p>
  );
}

function Brand({ light = false }) {
  return (
    <a
      href="#top"
      className="inline-flex shrink-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A04A] focus-visible:ring-offset-4"
      aria-label="BIOCIRCULAR — página inicial"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D6A04A] text-sm font-extrabold tracking-tight text-[#0B1726] shadow-sm">
        BC
      </span>

      <span>
        <span
          className={`block text-base font-extrabold tracking-[0.12em] sm:text-lg ${
            light ? 'text-white' : 'text-[#17202A]'
          }`}
        >
          BIOCIRCULAR
        </span>
        <span
          className={`mt-0.5 block text-[11px] ${
            light ? 'text-slate-400' : 'text-[#667085]'
          }`}
        >
          Gestão e rastreabilidade
        </span>
      </span>
    </a>
  );
}

export default function LandingPage({ onNavigate }) {
  const [menuAberto, setMenuAberto] = useState(false);

  function irParaLogin() {
    setMenuAberto(false);
    onNavigate?.('login');
  }

  function fecharMenu() {
    setMenuAberto(false);
  }

  const links = [
    ['Como funciona', '#como-funciona'],
    ['Etapas da operação', '#ciclo'],
    ['Benefícios', '#impacto'],
    ['Contato', '#contato'],
  ];

  return (
    <div className="min-h-screen overflow-x-clip bg-[#F5F7FA] font-sans text-[#17202A] antialiased">
      {/* Cabeçalho */}
      <header className="relative z-50 border-b border-white/10 bg-[#0B1726] text-white shadow-sm">
        <div className="mx-auto flex min-h-[76px] max-w-[1320px] items-center justify-between gap-5 px-5 py-3 sm:px-8 lg:px-10">
          <Brand light />

          <nav
            aria-label="Navegação principal"
            className="hidden items-center gap-7 xl:flex"
          >
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="whitespace-nowrap py-3 text-sm font-medium text-slate-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A04A]"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={irParaLogin}
              className="hidden min-h-11 items-center justify-center gap-2 rounded-lg bg-[#D6A04A] px-5 text-sm font-bold text-[#0B1726] transition-colors hover:bg-[#E6B968] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1726] sm:inline-flex"
            >
              Acessar sistema
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setMenuAberto((aberto) => !aberto)}
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A04A] xl:hidden"
              aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuAberto}
              aria-controls="menu-mobile"
            >
              {menuAberto ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Menu responsivo */}
        {menuAberto && (
          <nav
            id="menu-mobile"
            aria-label="Navegação para celular"
            className="border-t border-white/10 bg-[#0F2033] px-5 py-4 shadow-xl sm:px-8 xl:hidden"
          >
            <div className="mx-auto flex max-w-[1320px] flex-col gap-1">
              {links.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={fecharMenu}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-slate-200 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  {label}
                </a>
              ))}

              <button
                type="button"
                onClick={irParaLogin}
                className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#D6A04A] px-4 py-3 text-sm font-bold text-[#0B1726] transition-colors hover:bg-[#E6B968] sm:hidden"
              >
                Acessar sistema
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </nav>
        )}
      </header>

      <main id="top">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#0B1726] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-48 -top-48 h-[580px] w-[580px] rounded-full border border-white/[0.045]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full border border-white/[0.06]"
          />

          <div className="relative mx-auto grid max-w-[1320px] items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
            <div className="relative z-10">
              <Eyebrow light>Plataforma para a cadeia do OGR</Eyebrow>

              <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[3.5rem] xl:text-[3.8rem]">
                Inteligência e rastreabilidade
                <span className="mt-2 block text-[#E2AD59]">
                  do óleo residual.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                Organize a operação de óleo e gordura residual com uma visão
                integrada das etapas, da identificação do recipiente à
                destinação final.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={irParaLogin}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#D6A04A] px-6 py-3 text-sm font-bold text-[#0B1726] transition-all hover:bg-[#E6B968] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1726]"
                >
                  Acessar a plataforma
                  <ArrowRight className="h-4 w-4" />
                </button>

                <a
                  href="#como-funciona"
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A04A]"
                >
                  Conheça a solução
                </a>
              </div>

              <div className="mt-9 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-3">
                {[
                  'Controle operacional',
                  'Histórico organizado',
                  'Dados para gestão',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs font-medium text-slate-300 sm:text-sm">
                    <Check className="h-4 w-4 shrink-0 text-[#E2AD59]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-2xl lg:ml-auto lg:mr-0">
              <div className="absolute -inset-4 rounded-3xl bg-[#284762]/20 blur-2xl" />

              <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#16324F] shadow-2xl shadow-black/30">
                <img
                  src={heroImage}
                  alt="Visão operacional da plataforma BIOCIRCULAR"
                  className="block aspect-[5/4] w-full object-cover sm:aspect-[6/5] lg:aspect-[5/4]"
                />

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B1726]/95 via-[#0B1726]/50 to-transparent p-5 pt-16 sm:p-7 sm:pt-20">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-[#E2AD59] backdrop-blur-sm">
                      <ShieldCheck className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white sm:text-base">
                        Operação conectada
                      </p>
                      <p className="mt-1 text-xs text-slate-300 sm:text-sm">
                        Da origem ao destino final
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-2 -top-3 hidden rounded-xl border border-white/10 bg-[#142B41] px-4 py-3 shadow-xl sm:block lg:-right-4">
                <p className="text-xs font-semibold text-white">
                  BIOCIRCULAR
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Gestão e rastreabilidade
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <section
          id="como-funciona"
          className="scroll-mt-6 bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24"
        >
          <div className="mx-auto max-w-[1320px]">
            <Eyebrow>Uma operação mais organizada</Eyebrow>

            <div className="mt-5 grid gap-5 lg:grid-cols-2 lg:items-end lg:gap-12">
              <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-[#17202A] sm:text-4xl lg:text-[2.75rem]">
                Menos fragmentação.
                <span className="block text-[#A96F1D]">
                  Mais visibilidade operacional.
                </span>
              </h2>

              <p className="max-w-2xl text-base leading-7 text-[#667085]">
                A cadeia do óleo e gordura residual envolve diferentes
                participantes e etapas. A BIOCIRCULAR busca reunir as
                informações da operação em um fluxo mais fácil de acompanhar.
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
              <article className="rounded-2xl border border-[#D9E0E7] bg-[#F5F7FA] p-6 sm:p-7">
                <span className="text-xs font-bold uppercase tracking-[0.13em] text-[#667085]">
                  Cenário fragmentado
                </span>
                <h3 className="mt-3 text-xl font-bold text-[#17202A]">
                  Informações dispersas
                </h3>

                <div className="mt-5 divide-y divide-[#D9E0E7]">
                  {[
                    'Planilhas e registros separados',
                    'Dificuldade para acompanhar etapas',
                    'Histórico operacional fragmentado',
                  ].map((item) => (
                    <p key={item} className="flex items-start gap-3 py-4 text-sm leading-6 text-[#667085]">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-slate-400" />
                      {item}
                    </p>
                  ))}
                </div>
              </article>

              <div className="flex items-center justify-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D6A04A] text-[#0B1726] shadow-sm">
                  <ArrowRight className="h-5 w-5 rotate-90 lg:rotate-0" />
                </span>
              </div>

              <article className="rounded-2xl border border-[#D9E0E7] bg-white p-6 shadow-lg shadow-slate-200/40 sm:p-7">
                <span className="text-xs font-bold uppercase tracking-[0.13em] text-[#A96F1D]">
                  Com a BIOCIRCULAR
                </span>
                <h3 className="mt-3 text-xl font-bold text-[#17202A]">
                  Fluxo mais organizado
                </h3>

                <div className="mt-5 divide-y divide-[#EDF0F2]">
                  {[
                    'Informações reunidas por etapa',
                    'Acompanhamento da operação',
                    'Registros organizados para consulta',
                  ].map((item) => (
                    <p key={item} className="flex items-start gap-3 py-4 text-sm leading-6 text-[#475467]">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-[#A96F1D]" />
                      {item}
                    </p>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Etapas da operação */}
        <section
          id="ciclo"
          className="scroll-mt-6 bg-[#0B1726] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-10 lg:py-24"
        >
          <div className="mx-auto max-w-[1320px]">
            <Eyebrow light>Como funciona o ciclo</Eyebrow>

            <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem]">
                Uma sequência de etapas,
                <span className="block text-[#E2AD59]">
                  da origem ao destino.
                </span>
              </h2>

              <p className="max-w-md text-sm leading-6 text-slate-400 sm:text-base">
                Cada etapa representa uma parte do fluxo operacional e ajuda a
                manter as informações organizadas ao longo do processo.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {steps.map(([number, title, description, Icon]) => (
                <article
                  key={number}
                  className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-all hover:-translate-y-1 hover:border-[#D6A04A]/50 hover:bg-white/[0.07] sm:p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold tracking-wider text-[#E2AD59]">
                      {number}
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D6A04A]/10 text-[#E2AD59] transition-colors group-hover:bg-[#D6A04A]/20">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>

                  <h3 className="mt-7 text-base font-bold leading-6 text-white">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {description}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#E2AD59]" />
                <p className="text-sm leading-6 text-slate-300">
                  Um histórico operacional organizado facilita a consulta das
                  informações de cada etapa.
                </p>
              </div>

              <span className="self-start whitespace-nowrap rounded-full bg-[#D6A04A]/15 px-3 py-1.5 text-xs font-bold text-[#E2AD59] sm:self-center">
                Origem · coleta · destino
              </span>
            </div>
          </div>
        </section>

        {/* Benefícios */}
        <section
          id="impacto"
          className="scroll-mt-6 bg-[#F5F7FA] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24"
        >
          <div className="mx-auto max-w-[1320px]">
            <Eyebrow>Recursos da plataforma</Eyebrow>

            <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-[#17202A] sm:text-4xl lg:text-[2.75rem]">
                  Tecnologia para apoiar
                  <span className="block text-[#A96F1D]">
                    a gestão da operação.
                  </span>
                </h2>

                <p className="mt-5 max-w-2xl text-base leading-7 text-[#667085]">
                  Conheça os principais eixos apresentados pela BIOCIRCULAR
                  para organizar o acompanhamento das atividades.
                </p>
              </div>

              <a
                href="#contato"
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-lg border border-[#D9E0E7] bg-white px-5 py-3 text-sm font-semibold text-[#17202A] transition-colors hover:border-[#A96F1D] hover:text-[#A96F1D]"
              >
                Fale com a equipe
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {features.map(([title, label, description, Icon, items]) => (
                <article
                  key={title}
                  className="flex h-full flex-col rounded-2xl border border-[#E0E6EC] bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50 sm:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F8EEDC] text-[#9B681F]">
                      <Icon className="h-6 w-6" />
                    </span>

                    <span className="max-w-[65%] rounded-full bg-[#F5F7FA] px-3 py-1.5 text-right text-[10px] font-bold uppercase tracking-wider text-[#667085]">
                      {label}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold leading-snug text-[#17202A]">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#667085]">
                    {description}
                  </p>

                  <ul className="mt-6 space-y-3 border-t border-[#EDF0F2] pt-5">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-5 text-[#344054]">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#A96F1D]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Ecossistema: categorias operacionais, sem logotipos fictícios */}
        <section className="border-y border-[#E0E6EC] bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <div className="mx-auto max-w-[1320px]">
            <Eyebrow>Ecossistema operacional</Eyebrow>

            <div className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-12">
              <h2 className="text-3xl font-bold leading-tight tracking-tight text-[#17202A] sm:text-4xl">
                Diferentes etapas.
                <span className="block text-[#A96F1D]">
                  Uma visão integrada.
                </span>
              </h2>

              <p className="max-w-2xl text-base leading-7 text-[#667085]">
                A operação envolve diferentes atividades e participantes.
                A plataforma apresenta recursos para organizar as informações
                relacionadas a esse fluxo.
              </p>
            </div>

            <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {ecosystem.map(({ icon: Icon, title, description }) => (
                <article
                  key={title}
                  className="rounded-xl border border-[#E0E6EC] bg-[#F8FAFC] p-5 transition-colors hover:border-[#D6A04A]/70 hover:bg-white sm:p-6"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF0F5] text-[#16324F]">
                    <Icon className="h-5 w-5" />
                  </span>

                  <h3 className="mt-4 text-base font-bold text-[#17202A]">
                    {title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#667085]">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Contato / chamada para ação */}
        <section
          id="contato"
          className="scroll-mt-6 bg-[#16324F] px-5 py-14 text-white sm:px-8 sm:py-16 lg:px-10 lg:py-20"
        >
          <div className="mx-auto flex max-w-[1320px] flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <Eyebrow light>Vamos conversar</Eyebrow>

              <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                Conheça a plataforma BIOCIRCULAR.
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                Acesse o sistema para conhecer o ambiente operacional e os
                recursos disponíveis para o seu perfil.
              </p>
            </div>

            <button
              type="button"
              onClick={irParaLogin}
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-[#D6A04A] px-6 py-3 text-sm font-bold text-[#0B1726] transition-colors hover:bg-[#E6B968] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#16324F] lg:self-center"
            >
              Acessar sistema
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </main>

      {/* Rodapé */}
      <footer className="bg-[#0B1726] px-5 py-10 text-white sm:px-8 sm:py-12 lg:px-10">
        <div className="mx-auto grid max-w-[1320px] gap-9 border-b border-white/10 pb-9 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_0.8fr] lg:gap-12">
          <div>
            <Brand light />

            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">
              Gestão, rastreabilidade e organização operacional para a cadeia
              do óleo e gordura residual.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-[#E2AD59]">
              Institucional
            </h3>

            <nav className="mt-4 flex flex-col items-start gap-3 text-sm text-slate-400">
              {links.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className="transition-colors hover:text-white"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-[#E2AD59]">
              Contato
            </h3>

            <a
              href="mailto:contato@biocircular.com.br"
              className="mt-4 inline-block break-words text-sm text-slate-300 transition-colors hover:text-white"
            >
              contato@biocircular.com.br
            </a>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Atendimento institucional e comercial.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-[#E2AD59]">
              Sistema
            </h3>

            <button
              type="button"
              onClick={irParaLogin}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              Acessar login
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mx-auto flex max-w-[1320px] flex-col gap-3 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 BIOCIRCULAR. Todos os direitos reservados.</span>
          <a href="#top" className="transition-colors hover:text-slate-300">
            Voltar ao topo ↑
          </a>
        </div>
      </footer>
    </div>
  );
}
