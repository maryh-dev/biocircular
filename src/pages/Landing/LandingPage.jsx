import React, { lazy, Suspense, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
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

const DrumViewer = lazy(() => import('../../components/DrumViewer.jsx'));

const stepIcons = [ClipboardList, QrCode, Route, Truck, CircleUserRound];
const featureIcons = [ShieldCheck, Cpu, BarChart3];
const ecosystemIcons = [Building2, Truck, Recycle, FileCheck2];

const translations = {
  pt: {
    languageLabel: 'Idioma da página inicial',
    brandSubtitle: 'Gestão e rastreabilidade',
    brandAria: 'BIOCIRCULAR — página inicial',
    links: ['Como funciona', 'Etapas da operação', 'Benefícios', 'Contato'],
    accessSystem: 'Acessar sistema',
    accessPlatform: 'Acessar a plataforma',
    accessLogin: 'Acessar login',
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
    mainNav: 'Navegação principal',
    mobileNav: 'Navegação para celular',
    hero: {
      eyebrow: 'Plataforma para a cadeia do OGR',
      titleStart: 'Inteligência e rastreabilidade',
      titleEnd: 'do óleo residual.',
      description: 'Organize a operação de óleo e gordura residual com uma visão integrada das etapas, da identificação do recipiente à destinação final.',
      learn: 'Conheça a solução',
      badges: ['Controle operacional', 'Histórico organizado', 'Dados para gestão'],
      imageAlt: 'Visão operacional da plataforma BIOCIRCULAR',
      connected: 'Operação conectada',
      connectedSubtitle: 'Da origem ao destino final',
      brandCard: 'Gestão e rastreabilidade',
    },
    overview: {
      eyebrow: 'Uma operação mais organizada',
      titleStart: 'Menos fragmentação.',
      titleEnd: 'Mais visibilidade operacional.',
      description: 'A cadeia do óleo e gordura residual envolve diferentes participantes e etapas. A BIOCIRCULAR busca reunir as informações da operação em um fluxo mais fácil de acompanhar.',
      beforeLabel: 'Cenário fragmentado',
      beforeTitle: 'Informações dispersas',
      beforeItems: ['Planilhas e registros separados', 'Dificuldade para acompanhar etapas', 'Histórico operacional fragmentado'],
      afterLabel: 'Com a BIOCIRCULAR',
      afterTitle: 'Fluxo mais organizado',
      afterItems: ['Informações reunidas por etapa', 'Acompanhamento da operação', 'Registros organizados para consulta'],
    },
    cycle: {
      eyebrow: 'Como funciona o ciclo',
      titleStart: 'Uma sequência de etapas,',
      titleEnd: 'da origem ao destino.',
      description: 'Cada etapa representa uma parte do fluxo operacional e ajuda a manter as informações organizadas ao longo do processo.',
      summary: 'Um histórico operacional organizado facilita a consulta das informações de cada etapa.',
      stages: 'Origem · coleta · destino',
      steps: [
        ['Cadastro', 'Geradores, unidades e recipientes organizados.'],
        ['Identificação por QR Code', 'Cada recipiente recebe uma identidade única.'],
        ['Solicitação e rota', 'Janelas, volumes e localização organizados.'],
        ['Coleta e lote', 'Quantidade e responsáveis registrados.'],
        ['Destinação final', 'Histórico operacional até o destino.'],
      ],
    },
    benefits: {
      eyebrow: 'Recursos da plataforma',
      titleStart: 'Tecnologia para apoiar',
      titleEnd: 'a gestão da operação.',
      description: 'Conheça os principais eixos apresentados pela BIOCIRCULAR para organizar o acompanhamento das atividades.',
      contact: 'Fale com a equipe',
      cards: [
        ['Rastreabilidade operacional', 'PASSAPORTE CIRCULAR', 'Conecte identificação, coleta, lote e destinação em um histórico operacional organizado.', ['Eventos vinculados à origem', 'Responsabilidades e estados visíveis', 'Informações para consulta']],
        ['Organização logística', 'GESTÃO DE OPERAÇÕES', 'Reúna solicitações, volumes, janelas e localização para apoiar o planejamento das coletas.', ['Contexto territorial organizado', 'Informações para planejar rotas', 'Acompanhamento das coletas']],
        ['Dados para gestão', 'RELATÓRIOS OPERACIONAIS', 'Utilize os registros da operação para apoiar o acompanhamento e a tomada de decisão.', ['Histórico por gerador e período', 'Dados operacionais organizados', 'Registros de destinação']],
      ],
    },
    ecosystem: {
      eyebrow: 'Ecossistema operacional',
      titleStart: 'Diferentes etapas.',
      titleEnd: 'Uma visão integrada.',
      description: 'A operação envolve diferentes atividades e participantes. A plataforma apresenta recursos para organizar as informações relacionadas a esse fluxo.',
      items: [
        ['Geradores', 'Organização das unidades geradoras e dos recipientes.'],
        ['Coletas', 'Acompanhamento das solicitações e etapas operacionais.'],
        ['Destinação', 'Continuidade do histórico até a etapa de destinação.'],
        ['Registros', 'Informações organizadas para consulta e gestão.'],
      ],
    },
    contact: {
      eyebrow: 'Vamos conversar',
      title: 'Conheça a plataforma BIOCIRCULAR.',
      description: 'Acesse o sistema para conhecer o ambiente operacional e os recursos disponíveis para o seu perfil.',
    },
    footer: {
      description: 'Gestão, rastreabilidade e organização operacional para a cadeia do óleo e gordura residual.',
      institutional: 'Institucional',
      contact: 'Contato',
      service: 'Atendimento institucional e comercial.',
      system: 'Sistema',
      copyright: '© 2026 BIOCIRCULAR. Todos os direitos reservados.',
      backToTop: 'Voltar ao topo ↑',
    },
  },
  en: {
    languageLabel: 'Homepage language',
    brandSubtitle: 'Operations and traceability',
    brandAria: 'BIOCIRCULAR — homepage',
    links: ['How it works', 'Operational stages', 'Benefits', 'Contact'],
    accessSystem: 'Access the system',
    accessPlatform: 'Access the platform',
    accessLogin: 'Sign in',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    mainNav: 'Main navigation',
    mobileNav: 'Mobile navigation',
    hero: {
      eyebrow: 'A platform for the waste oil and grease chain',
      titleStart: 'Intelligence and traceability',
      titleEnd: 'for residual oil.',
      description: 'Coordinate waste oil and grease operations with an integrated view of every stage, from container identification to final destination.',
      learn: 'Explore the platform',
      badges: ['Operational control', 'Organized history', 'Management insights'],
      imageAlt: 'Operational view of the BIOCIRCULAR platform',
      connected: 'Connected operations',
      connectedSubtitle: 'From source to final destination',
      brandCard: 'Operations and traceability',
    },
    overview: {
      eyebrow: 'A more organized operation',
      titleStart: 'Less fragmentation.',
      titleEnd: 'More operational visibility.',
      description: 'The waste oil and grease chain involves different participants and stages. BIOCIRCULAR brings operational information together in an easier-to-follow workflow.',
      beforeLabel: 'Fragmented process',
      beforeTitle: 'Scattered information',
      beforeItems: ['Separate spreadsheets and records', 'Difficult-to-track stages', 'Fragmented operational history'],
      afterLabel: 'With BIOCIRCULAR',
      afterTitle: 'A more organized workflow',
      afterItems: ['Information grouped by stage', 'Operational tracking', 'Records organized for reference'],
    },
    cycle: {
      eyebrow: 'How the cycle works',
      titleStart: 'A sequence of stages,',
      titleEnd: 'from source to destination.',
      description: 'Each stage is part of the operational workflow and helps keep information organized throughout the process.',
      summary: 'An organized operational history makes it easier to review information at every stage.',
      stages: 'Source · collection · destination',
      steps: [
        ['Registration', 'Generators, sites, and containers organized.'],
        ['QR code identification', 'Every container receives a unique identity.'],
        ['Request and route', 'Time slots, volumes, and locations organized.'],
        ['Collection and batch', 'Volumes and responsible staff recorded.'],
        ['Final destination', 'Operational history through final processing.'],
      ],
    },
    benefits: {
      eyebrow: 'Platform capabilities',
      titleStart: 'Technology to support',
      titleEnd: 'operational management.',
      description: 'Explore the main BIOCIRCULAR capabilities for organizing and monitoring operations.',
      contact: 'Contact our team',
      cards: [
        ['Operational traceability', 'CIRCULAR PASSPORT', 'Connect identification, collection, batches, and destination in an organized operational history.', ['Events linked to their source', 'Visible responsibilities and statuses', 'Information ready for review']],
        ['Logistics organization', 'OPERATIONS MANAGEMENT', 'Bring requests, volumes, time slots, and locations together to support collection planning.', ['Organized location context', 'Information for route planning', 'Collection tracking']],
        ['Management data', 'OPERATIONAL REPORTS', 'Use operational records to support monitoring and informed decisions.', ['History by generator and period', 'Organized operational data', 'Destination records']],
      ],
    },
    ecosystem: {
      eyebrow: 'Operational ecosystem',
      titleStart: 'Different stages.',
      titleEnd: 'One integrated view.',
      description: 'Operations involve different activities and participants. The platform helps organize the information related to this workflow.',
      items: [
        ['Generators', 'Organize generating sites and their containers.'],
        ['Collections', 'Track requests and operational stages.'],
        ['Destination', 'Continue the history through final processing.'],
        ['Records', 'Information organized for review and management.'],
      ],
    },
    contact: {
      eyebrow: "Let's talk",
      title: 'Discover the BIOCIRCULAR platform.',
      description: 'Access the system to explore the operational workspace and the features available for your role.',
    },
    footer: {
      description: 'Operations management, traceability, and organization for the waste oil and grease chain.',
      institutional: 'Company',
      contact: 'Contact',
      service: 'Institutional and commercial support.',
      system: 'System',
      copyright: '© 2026 BIOCIRCULAR. All rights reserved.',
      backToTop: 'Back to top ↑',
    },
  },
  es: {
    languageLabel: 'Idioma de la página de inicio',
    brandSubtitle: 'Gestión y trazabilidad',
    brandAria: 'BIOCIRCULAR — página de inicio',
    links: ['Cómo funciona', 'Etapas de la operación', 'Beneficios', 'Contacto'],
    accessSystem: 'Acceder al sistema',
    accessPlatform: 'Acceder a la plataforma',
    accessLogin: 'Iniciar sesión',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    mainNav: 'Navegación principal',
    mobileNav: 'Navegación móvil',
    hero: {
      eyebrow: 'Plataforma para la cadena del aceite residual',
      titleStart: 'Inteligencia y trazabilidad',
      titleEnd: 'del aceite residual.',
      description: 'Organiza la operación de aceites y grasas residuales con una visión integrada de cada etapa, desde la identificación del recipiente hasta el destino final.',
      learn: 'Conoce la solución',
      badges: ['Control operativo', 'Historial organizado', 'Datos para la gestión'],
      imageAlt: 'Vista operativa de la plataforma BIOCIRCULAR',
      connected: 'Operación conectada',
      connectedSubtitle: 'Del origen al destino final',
      brandCard: 'Gestión y trazabilidad',
    },
    overview: {
      eyebrow: 'Una operación más organizada',
      titleStart: 'Menos fragmentación.',
      titleEnd: 'Más visibilidad operativa.',
      description: 'La cadena de aceites y grasas residuales involucra diferentes participantes y etapas. BIOCIRCULAR reúne la información operativa en un flujo más fácil de seguir.',
      beforeLabel: 'Proceso fragmentado',
      beforeTitle: 'Información dispersa',
      beforeItems: ['Hojas de cálculo y registros separados', 'Dificultad para seguir las etapas', 'Historial operativo fragmentado'],
      afterLabel: 'Con BIOCIRCULAR',
      afterTitle: 'Flujo más organizado',
      afterItems: ['Información reunida por etapa', 'Seguimiento de la operación', 'Registros organizados para consulta'],
    },
    cycle: {
      eyebrow: 'Cómo funciona el ciclo',
      titleStart: 'Una secuencia de etapas,',
      titleEnd: 'del origen al destino.',
      description: 'Cada etapa forma parte del flujo operativo y ayuda a mantener la información organizada durante todo el proceso.',
      summary: 'Un historial operativo organizado facilita la consulta de la información de cada etapa.',
      stages: 'Origen · recolección · destino',
      steps: [
        ['Registro', 'Generadores, unidades y recipientes organizados.'],
        ['Identificación por QR', 'Cada recipiente recibe una identidad única.'],
        ['Solicitud y ruta', 'Horarios, volúmenes y ubicaciones organizados.'],
        ['Recolección y lote', 'Cantidades y responsables registrados.'],
        ['Destino final', 'Historial operativo hasta el destino.'],
      ],
    },
    benefits: {
      eyebrow: 'Funciones de la plataforma',
      titleStart: 'Tecnología para apoyar',
      titleEnd: 'la gestión operativa.',
      description: 'Conoce las principales funciones de BIOCIRCULAR para organizar y supervisar las actividades.',
      contact: 'Habla con el equipo',
      cards: [
        ['Trazabilidad operativa', 'PASAPORTE CIRCULAR', 'Conecta identificación, recolección, lotes y destino en un historial operativo organizado.', ['Eventos vinculados al origen', 'Responsables y estados visibles', 'Información disponible para consulta']],
        ['Organización logística', 'GESTIÓN DE OPERACIONES', 'Reúne solicitudes, volúmenes, horarios y ubicaciones para apoyar la planificación de recolecciones.', ['Contexto territorial organizado', 'Información para planificar rutas', 'Seguimiento de recolecciones']],
        ['Datos para la gestión', 'INFORMES OPERATIVOS', 'Utiliza los registros para apoyar el seguimiento y la toma de decisiones.', ['Historial por generador y período', 'Datos operativos organizados', 'Registros de destino']],
      ],
    },
    ecosystem: {
      eyebrow: 'Ecosistema operativo',
      titleStart: 'Diferentes etapas.',
      titleEnd: 'Una visión integrada.',
      description: 'La operación incluye diferentes actividades y participantes. La plataforma ayuda a organizar la información relacionada con este flujo.',
      items: [
        ['Generadores', 'Organización de las unidades generadoras y los recipientes.'],
        ['Recolecciones', 'Seguimiento de solicitudes y etapas operativas.'],
        ['Destino', 'Continuidad del historial hasta la etapa final.'],
        ['Registros', 'Información organizada para consulta y gestión.'],
      ],
    },
    contact: {
      eyebrow: 'Hablemos',
      title: 'Conoce la plataforma BIOCIRCULAR.',
      description: 'Accede al sistema para conocer el entorno operativo y las funciones disponibles para tu perfil.',
    },
    footer: {
      description: 'Gestión, trazabilidad y organización operativa para la cadena de aceites y grasas residuales.',
      institutional: 'Institucional',
      contact: 'Contacto',
      service: 'Atención institucional y comercial.',
      system: 'Sistema',
      copyright: '© 2026 BIOCIRCULAR. Todos los derechos reservados.',
      backToTop: 'Volver arriba ↑',
    },
  },
};

const languageOptions = [
  ['pt', 'Português'],
  ['en', 'English'],
  ['es', 'Español'],
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

function Brand({ light = false, copy }) {
  return (
    <a
      href="#top"
      className="inline-flex shrink-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A04A] focus-visible:ring-offset-4"
      aria-label={copy.brandAria}
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
          {copy.brandSubtitle}
        </span>
      </span>
    </a>
  );
}

export default function LandingPage({ onNavigate }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [idioma, setIdioma] = useState(() => {
    try {
      const salvo = window.localStorage.getItem('biocircular-landing-language');
      return translations[salvo] ? salvo : 'pt';
    } catch {
      return 'pt';
    }
  });
  const copy = translations[idioma];

  function irParaLogin() {
    setMenuAberto(false);
    onNavigate?.('login');
  }

  function fecharMenu() {
    setMenuAberto(false);
  }

  const links = copy.links.map((label, index) => [
    label,
    ['#como-funciona', '#ciclo', '#impacto', '#contato'][index],
  ]);

  return (
    <div lang={idioma === 'pt' ? 'pt-BR' : idioma} className="min-h-screen overflow-x-clip bg-[#F5F7FA] font-sans text-[#17202A] antialiased">
      {/* Cabeçalho */}
      <header className="relative z-50 border-b border-white/10 bg-[#0B1726] text-white shadow-sm">
        <div className="mx-auto flex min-h-[76px] max-w-[1320px] items-center justify-between gap-5 px-5 py-3 sm:px-8 lg:px-10">
          <Brand light copy={copy} />

          <nav
            aria-label={copy.mainNav}
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
            <div className="relative inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[#142B41] px-2.5 py-1.5 shadow-inner shadow-black/15">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                {copy.languageLabel.split(' ')[0]}
              </span>

              <label className="sr-only" htmlFor="landing-language">
                {copy.languageLabel}
              </label>

              <select
                id="landing-language"
                value={idioma}
                onChange={(event) => {
                  const proximoIdioma = event.target.value;
                  setIdioma(proximoIdioma);
                  try {
                    window.localStorage.setItem('biocircular-landing-language', proximoIdioma);
                  } catch {
                    // A tradução continua disponível mesmo se o navegador bloquear o armazenamento local.
                  }
                }}
                className="appearance-none bg-transparent pr-6 text-[11px] font-bold uppercase tracking-[0.12em] text-white outline-none transition-colors focus:text-[#F4D08A]"
                aria-label={copy.languageLabel}
              >
                {languageOptions.map(([value, label]) => (
                  <option key={value} value={value} className="bg-[#142B41] text-white">
                    {label}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-slate-300" />
            </div>

            <button
              type="button"
              onClick={irParaLogin}
              className="hidden min-h-11 items-center justify-center gap-2 rounded-lg bg-[#D6A04A] px-5 text-sm font-bold text-[#0B1726] transition-colors hover:bg-[#E6B968] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1726] sm:inline-flex"
            >
              {copy.accessSystem}
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setMenuAberto((aberto) => !aberto)}
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A04A] xl:hidden"
              aria-label={menuAberto ? copy.closeMenu : copy.openMenu}
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
            aria-label={copy.mobileNav}
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
                {copy.accessSystem}
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
              <Eyebrow light>{copy.hero.eyebrow}</Eyebrow>

              <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[3.5rem] xl:text-[3.8rem]">
                {copy.hero.titleStart}
                <span className="mt-2 block text-[#E2AD59]">
                  {copy.hero.titleEnd}
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                {copy.hero.description}
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={irParaLogin}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#D6A04A] px-6 py-3 text-sm font-bold text-[#0B1726] transition-all hover:bg-[#E6B968] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1726]"
                >
                  {copy.accessPlatform}
                  <ArrowRight className="h-4 w-4" />
                </button>

                <a
                  href="#como-funciona"
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A04A]"
                >
                  {copy.hero.learn}
                </a>
              </div>

              <div className="mt-9 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-2">
                {copy.hero.badges.slice(0, 2).map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs font-medium text-slate-300 sm:text-sm">
                    <Check className="h-4 w-4 shrink-0 text-[#E2AD59]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-2xl lg:ml-auto lg:mr-0">
              <div className="absolute -inset-4 rounded-3xl bg-[#284762]/20 blur-2xl" />

              <div className="relative overflow-hidden rounded-2xl border border-white/15 shadow-2xl shadow-black/30">
                <Suspense
                  fallback={(
                    <img
                      src={heroImage}
                      alt={copy.hero.imageAlt}
                      className="block aspect-[5/4] w-full object-cover sm:aspect-[6/5] lg:aspect-[5/4]"
                    />
                  )}
                >
                  <DrumViewer
                    fallbackImage={heroImage}
                    language={idioma}
                    imageAlt={copy.hero.imageAlt}
                  />
                </Suspense>
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
            <Eyebrow>{copy.overview.eyebrow}</Eyebrow>

            <div className="mt-5 grid gap-5 lg:grid-cols-2 lg:items-end lg:gap-12">
              <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-[#17202A] sm:text-4xl lg:text-[2.75rem]">
                {copy.overview.titleStart}
                <span className="block text-[#A96F1D]">
                  {copy.overview.titleEnd}
                </span>
              </h2>

              <p className="max-w-2xl text-base leading-7 text-[#667085]">
                {copy.overview.description}
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
              <article className="rounded-2xl border border-[#D9E0E7] bg-[#F5F7FA] p-6 sm:p-7">
                <span className="text-xs font-bold uppercase tracking-[0.13em] text-[#667085]">
                  {copy.overview.beforeLabel}
                </span>
                <h3 className="mt-3 text-xl font-bold text-[#17202A]">
                  {copy.overview.beforeTitle}
                </h3>

                <div className="mt-5 divide-y divide-[#D9E0E7]">
                  {copy.overview.beforeItems.map((item) => (
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
                  {copy.overview.afterLabel}
                </span>
                <h3 className="mt-3 text-xl font-bold text-[#17202A]">
                  {copy.overview.afterTitle}
                </h3>

                <div className="mt-5 divide-y divide-[#EDF0F2]">
                  {copy.overview.afterItems.map((item) => (
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
            <Eyebrow light>{copy.cycle.eyebrow}</Eyebrow>

            <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem]">
                {copy.cycle.titleStart}
                <span className="block text-[#E2AD59]">
                  {copy.cycle.titleEnd}
                </span>
              </h2>

              <p className="max-w-md text-sm leading-6 text-slate-400 sm:text-base">
                {copy.cycle.description}
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {copy.cycle.steps.map(([title, description], index) => {
                const Icon = stepIcons[index];
                const number = `0${index + 1}`;

                return (
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
                );
              })}
            </div>

            <div className="mt-6 flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#E2AD59]" />
                <p className="text-sm leading-6 text-slate-300">
                  {copy.cycle.summary}
                </p>
              </div>

              <span className="self-start whitespace-nowrap rounded-full bg-[#D6A04A]/15 px-3 py-1.5 text-xs font-bold text-[#E2AD59] sm:self-center">
                {copy.cycle.stages}
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
            <Eyebrow>{copy.benefits.eyebrow}</Eyebrow>

            <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-[#17202A] sm:text-4xl lg:text-[2.75rem]">
                  {copy.benefits.titleStart}
                  <span className="block text-[#A96F1D]">
                    {copy.benefits.titleEnd}
                  </span>
                </h2>

                <p className="mt-5 max-w-2xl text-base leading-7 text-[#667085]">
                  {copy.benefits.description}
                </p>
              </div>

              <a
                href="#contato"
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-lg border border-[#D9E0E7] bg-white px-5 py-3 text-sm font-semibold text-[#17202A] transition-colors hover:border-[#A96F1D] hover:text-[#A96F1D]"
              >
                {copy.benefits.contact}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {copy.benefits.cards.map(([title, label, description, items], index) => {
                const Icon = featureIcons[index];

                return (
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
                );
              })}
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
              <Eyebrow light>{copy.contact.eyebrow}</Eyebrow>

              <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                {copy.contact.title}
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                {copy.contact.description}
              </p>
            </div>

            <button
              type="button"
              onClick={irParaLogin}
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-[#D6A04A] px-6 py-3 text-sm font-bold text-[#0B1726] transition-colors hover:bg-[#E6B968] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#16324F] lg:self-center"
            >
              {copy.accessSystem}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </main>

      {/* Rodapé */}
      <footer className="bg-[#0B1726] px-5 py-10 text-white sm:px-8 sm:py-12 lg:px-10">
        <div className="mx-auto grid max-w-[1320px] gap-9 border-b border-white/10 pb-9 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_0.8fr] lg:gap-12">
          <div>
            <Brand light copy={copy} />

            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">
              {copy.footer.description}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-[#E2AD59]">
              {copy.footer.institutional}
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
              {copy.footer.contact}
            </h3>

            <a
              href="mailto:contato@biocircular.com.br"
              className="mt-4 inline-block break-words text-sm text-slate-300 transition-colors hover:text-white"
            >
              contato@biocircular.com.br
            </a>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              {copy.footer.service}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-[#E2AD59]">
              {copy.footer.system}
            </h3>

            <button
              type="button"
              onClick={irParaLogin}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              {copy.accessLogin}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mx-auto flex max-w-[1320px] flex-col gap-3 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>{copy.footer.copyright}</span>
          <a href="#top" className="transition-colors hover:text-slate-300">
            {copy.footer.backToTop}
          </a>
        </div>
      </footer>
    </div>
  );
}