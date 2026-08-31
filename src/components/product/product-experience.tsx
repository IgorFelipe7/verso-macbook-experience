import { BatteryCharging, Contrast, Monitor, Sparkles } from "lucide-react";

import { FrameSequenceHero } from "@/components/ui/mac-book-neo-hero";
import type { FrameSequenceStep } from "@/components/ui/mac-book-neo-hero";
import { framePath } from "@/lib/utils";
import {
  ACCENT,
  HERO_COPY,
  MOMENTS,
  SECTION_IDS,
  SEQUENCE,
} from "@/content/product";

import { EditorialStatement } from "./editorial-statement";
import { FinalProductCta } from "./final-product-cta";
import { ProductHighlights } from "./product-highlights";
import { ScrollFeature } from "./scroll-feature";
import { SiteFooter } from "./site-footer";
import { SiteNav } from "./site-nav";

const heroSteps: FrameSequenceStep[] = [
  {
    from: 0.02,
    to: 0.28,
    color: ACCENT.colors,
    num: "01",
    total: "04",
    icon: <Sparkles size={18} strokeWidth={2.2} />,
    title: "Cinco cores vivas.",
    description:
      "Amarelo, rosa, azul, prateado e meia-noite. Escolha a que combina com você.",
    label: "Cores",
  },
  {
    from: 0.28,
    to: 0.55,
    color: ACCENT.design,
    num: "02",
    total: "04",
    icon: <Contrast size={18} strokeWidth={2.2} />,
    title: "Uma silhueta refinada.",
    description:
      "11,3 mm de espessura e 1,24 kg. O MacBook mais portátil já construído.",
    label: "Design",
  },
  {
    from: 0.55,
    to: 0.82,
    color: ACCENT.display,
    num: "03",
    total: "04",
    icon: <Monitor size={18} strokeWidth={2.2} />,
    title: "Uma tela que hipnotiza.",
    description:
      "Liquid Retina XDR com 1.000 nits sustentados. ProMotion de 120 Hz para um movimento impecável.",
    label: "Tela",
  },
  {
    from: 0.82,
    to: 1.01,
    color: ACCENT.battery,
    num: "04",
    total: "04",
    icon: <BatteryCharging size={18} strokeWidth={2.2} />,
    title: "Feito para o dia inteiro.",
    description:
      "Até 22 horas de bateria. Silencioso, onde quer que você vá.",
    label: "Bateria",
  },
];

export function ProductExperience() {
  return (
    <>
      <a className="skip-link" href={`#${SECTION_IDS.statement}`}>
        Pular para o conteúdo
      </a>

      <SiteNav />

      <main id="topo">
        <FrameSequenceHero
          id={SECTION_IDS.hero}
          frameCount={SEQUENCE.count}
          framePath={framePath}
          eagerCount={SEQUENCE.eager}
          scrollHeight="600vh"
          title={
            <>
              <span className="fsh-title-dark">{HERO_COPY.titleLead}</span>{" "}
              <span className="fsh-title-rainbow">{HERO_COPY.titleAccent}</span>
            </>
          }
          subtitle={HERO_COPY.subtitle}
          steps={heroSteps}
          loadingLabel={HERO_COPY.loading}
          readyLabel={HERO_COPY.ready}
        />

        <EditorialStatement />
        <ProductHighlights />

        {MOMENTS.map((moment) => (
          <ScrollFeature key={moment.id} moment={moment} />
        ))}

        <FinalProductCta />
      </main>

      <SiteFooter />
    </>
  );
}
