import type { ReactNode } from "react";

/**
 * Single source of truth for copy, section ids and every frame the editorial
 * sections borrow from the sequence. Change a scene here, not in the markup.
 */

export const SEQUENCE = {
  /** public/sequence/frame_0001.jpg … frame_0941.jpg */
  count: 941,
  /** Frames requested before the experience is handed to the user. */
  eager: 90,
} as const;

export const BRAND = {
  name: "neo.",
  product: "MacBook Neo",
} as const;

export const SECTION_IDS = {
  hero: "inicio",
  statement: "visao-geral",
  highlights: "destaques",
  design: "design",
  display: "tela",
  colors: "cores",
  closing: "final",
} as const;

export const NAV_LINKS = [
  { label: "Visão geral", id: SECTION_IDS.statement },
  { label: "Destaques", id: SECTION_IDS.highlights },
  { label: "Tela", id: SECTION_IDS.display },
  { label: "Cores", id: SECTION_IDS.colors },
] as const;

export const CTA = {
  label: "Comprar",
  href: "#",
} as const;

export const ACCENT = {
  colors: "#ff9f3a",
  design: "#ff6f9c",
  display: "#5e9bff",
  battery: "#a37bff",
} as const;

/* ------------------------------------------------------------------ hero */

export type HeroStep = {
  from: number;
  to: number;
  color: string;
  num: string;
  total: string;
  icon?: ReactNode;
  title: string;
  description: string;
  label: string;
};

export const HERO_COPY = {
  titleLead: "MacBook",
  titleAccent: "Neo",
  subtitle: "Role para explorar.",
  loading: (pct: number) => `Carregando · ${pct}%`,
  ready: "Pronto",
} as const;

/* ------------------------------------------------------- editorial frames */

export type Scene = {
  /** Frame number inside public/sequence. */
  frame: number;
  /** Focal point of the product within the frame, in percent. */
  focusX: number;
  focusY: number;
  /** 1 = fit the whole frame. Above 1 crops in. Source is 1400×2164. */
  zoom: number;
};

/**
 * Frames chosen for their composition. The sequence is portrait, so the
 * product sits in distinct vertical bands — cropping to those bands reads as
 * separate product photography without adding a single new asset.
 */
export const SCENES = {
  /** Clean silver profile, product high in frame. */
  silhouette: { frame: 908, focusX: 50, focusY: 12.5, zoom: 1.6 },
  /** Vivid desktop, cropped into the panel itself. */
  display: { frame: 612, focusX: 50, focusY: 40.5, zoom: 1.7 },
  /** Full colour stack, uncropped. */
  colors: { frame: 96, focusX: 50, focusY: 50, zoom: 1 },
  /** Resolved closing shot. */
  closing: { frame: 908, focusX: 50, focusY: 18.4, zoom: 1.5 },
} as const satisfies Record<string, Scene>;

/* ------------------------------------------------------------- statement */

export const STATEMENT = {
  lines: ["Um novo jeito", "de levar tudo", "com você."],
  note: "11,3 mm de espessura. 1,24 kg. O MacBook mais portátil já feito.",
} as const;

/* ------------------------------------------------------------ highlights */

export type Highlight = {
  id: string;
  label: string;
  headline: string;
  body: string;
  accent: string;
  scene: Scene;
  /** Panel weight in the asymmetric grid. */
  span: "wide" | "tall" | "regular";
};

export const HIGHLIGHTS: Highlight[] = [
  {
    id: "design",
    label: "Design",
    headline: "11,3 mm. 1,24 kg.",
    body: "A espessura de um caderno, o peso de um livro. O MacBook mais portátil já construído.",
    accent: ACCENT.design,
    scene: { frame: 908, focusX: 50, focusY: 0, zoom: 1.6 },
    span: "wide",
  },
  {
    id: "tela",
    label: "Tela",
    headline: "Liquid Retina XDR",
    body: "1.000 nits sustentados e ProMotion de 120 Hz.",
    accent: ACCENT.display,
    scene: { frame: 612, focusX: 50, focusY: 32, zoom: 1.8 },
    span: "tall",
  },
  {
    id: "bateria",
    label: "Bateria",
    headline: "Até 22 horas",
    body: "Um dia inteiro longe da tomada. Silencioso, onde quer que você vá.",
    accent: ACCENT.battery,
    scene: { frame: 700, focusX: 50, focusY: 23.6, zoom: 1.4 },
    span: "regular",
  },
  {
    id: "cores",
    label: "Cores",
    headline: "Cinco cores vivas",
    body: "Amarelo, rosa, azul, prateado e meia-noite.",
    accent: ACCENT.colors,
    scene: { frame: 96, focusX: 50, focusY: 80, zoom: 1 },
    span: "regular",
  },
];

export const HIGHLIGHTS_HEADING = {
  label: "Destaques",
  title: "Cada detalhe, pensado para durar o dia.",
} as const;

/* ------------------------------------------------- scroll-driven moments */

export type Moment = {
  id: string;
  label: string;
  title: string;
  body: string;
  accent: string;
  scene: Scene;
  /** How the product behaves as the moment plays out. */
  treatment: "grow" | "detail" | "silhouette";
  /** Which side the copy sits on at desktop widths. */
  align: "left" | "right";
};

export const MOMENTS: Moment[] = [
  {
    id: SECTION_IDS.design,
    label: "Design",
    title: "Fino a ponto de sumir.",
    body: "São 11,3 mm de espessura e 1,24 kg. Ele desaparece dentro da mochila e reaparece exatamente onde você precisa.",
    accent: ACCENT.design,
    scene: SCENES.silhouette,
    treatment: "grow",
    align: "left",
  },
  {
    id: SECTION_IDS.display,
    label: "Tela",
    title: "Cada quadro, na velocidade do olhar.",
    body: "Liquid Retina XDR com 1.000 nits sustentados. ProMotion de 120 Hz para um movimento que nunca trava.",
    accent: ACCENT.display,
    scene: SCENES.display,
    treatment: "detail",
    align: "right",
  },
  {
    id: SECTION_IDS.colors,
    label: "Cores",
    title: "Cinco maneiras de ser você.",
    body: "Amarelo, rosa, azul, prateado e meia-noite. Escolha a que combina com você.",
    accent: ACCENT.colors,
    scene: SCENES.colors,
    treatment: "silhouette",
    align: "left",
  },
];

/* --------------------------------------------------------------- closing */

export const CLOSING = {
  label: "MacBook Neo",
  title: "Pronto para ir mais longe.",
  body: "Até 22 horas de bateria para um dia que não acaba cedo.",
  cta: "Conheça o Neo",
  ctaHref: "#",
} as const;

/* ---------------------------------------------------------------- footer */

export const FOOTER = {
  backToTop: "Voltar ao topo",
  /**
   * No Verso URL exists anywhere in this project, so the signature ships as
   * text. Pass `href` to VersoSignature once there is a real destination.
   */
  signature: { prefix: "Criado pela", name: "Verso", suffix: "." },
} as const;
