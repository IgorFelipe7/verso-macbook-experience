"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useSectionProgress } from "@/hooks/use-section-progress";
import { createFrameLoader } from "@/lib/frame-loader";
import { cx, range } from "@/lib/utils";

export type FrameSequenceStep = {
  from: number;
  to: number;
  color: string;
  num: string;
  total: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
  label: string;
};

export type FrameSequenceHeroProps = {
  id?: string;
  frameCount: number;
  framePath: (i: number) => string;
  eagerCount?: number;
  scrollHeight?: string;
  title: React.ReactNode;
  subtitle?: string;
  steps: FrameSequenceStep[];
  loadingLabel?: (pct: number) => string;
  readyLabel?: string;
  className?: string;
};

/** Where the hero starts handing the product over to the page below. */
const RELEASE_FROM = 0.9;

export function FrameSequenceHero({
  id,
  frameCount,
  framePath,
  eagerCount = 90,
  scrollHeight = "600vh",
  title,
  subtitle,
  steps,
  loadingLabel = (pct) => `Carregando · ${pct}%`,
  readyLabel = "Pronto",
  className,
}: FrameSequenceHeroProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const tickRefs = useRef<(HTMLElement | null)[][]>([]);

  const loaderRef = useRef<ReturnType<typeof createFrameLoader> | null>(null);
  const targetFrameRef = useRef(0);
  const displayFrameRef = useRef(0);
  const paintedRef = useRef(-1);
  const activeIdxRef = useRef(-2);

  const [loadPct, setLoadPct] = useState(0);
  const [loaderDone, setLoaderDone] = useState(false);

  const reducedMotion = useReducedMotion();
  const reducedRef = useRef(reducedMotion);
  const stepsRef = useRef(steps);

  useEffect(() => {
    reducedRef.current = reducedMotion;
    stepsRef.current = steps;
  });

  /* ------------------------------------------------------------ loading */

  useEffect(() => {
    let pct = 0;

    const loader = createFrameLoader({
      count: frameCount,
      eager: eagerCount,
      path: framePath,
      onProgress: (loaded, criticalTotal) => {
        const next = Math.min(100, Math.round((loaded / criticalTotal) * 100));
        // One render per whole percent, and only while the loader is visible.
        if (next !== pct) {
          pct = next;
          setLoadPct(next);
        }
      },
      onReady: () => setLoaderDone(true),
    });

    loaderRef.current = loader;
    loader.start();

    return () => {
      loader.destroy();
      loaderRef.current = null;
    };
  }, [frameCount, eagerCount, framePath]);

  /* ------------------------------------------------------------ painting */

  const paint = (index: number) => {
    const loader = loaderRef.current;
    const img = imgRef.current;
    if (!loader || !img) return;

    // Fall back to the closest frame that actually has pixels, so scrubbing
    // through a not-yet-loaded stretch degrades smoothly instead of blanking.
    const usable = loader.nearestLoaded(index);
    if (usable < 0 || usable === paintedRef.current) return;

    paintedRef.current = usable;
    img.src = framePath(usable + 1);
  };

  /* -------------------------------------------------------------- scroll */

  useSectionProgress(
    scrollRef,
    (p) => {
      const stage = stageRef.current;
      if (!stage) return;

      targetFrameRef.current = p * (frameCount - 1);
      loaderRef.current?.setTarget(Math.round(targetFrameRef.current));

      // Ease the painted frame toward the scroll target. Preserved verbatim
      // from the original engine — this is what the scrub *feels* like.
      let animating = false;
      if (reducedRef.current) {
        displayFrameRef.current = targetFrameRef.current;
      } else {
        const diff = targetFrameRef.current - displayFrameRef.current;
        if (Math.abs(diff) < 0.08) {
          displayFrameRef.current = targetFrameRef.current;
        } else {
          displayFrameRef.current += diff * 0.28;
          animating = true;
        }
      }

      const idx = Math.max(
        0,
        Math.min(frameCount - 1, Math.round(displayFrameRef.current))
      );
      paint(idx);

      // Everything below is a style write — no React render, no layout read.
      const release = range(p, RELEASE_FROM, 1);
      stage.style.setProperty("--p", String(p));
      stage.style.setProperty("--rel", String(release));

      const list = stepsRef.current;
      let active = -1;
      let local = 0;
      for (let i = 0; i < list.length; i++) {
        const s = list[i];
        if (p >= s.from && p < s.to) {
          active = i;
          local = (p - s.from) / (s.to - s.from);
          break;
        }
      }
      // The last step releases with the stage so the UI clears before handoff.
      if (release > 0) active = -1;

      const cards = cardsRef.current;
      if (cards) {
        cards.style.setProperty(
          "--sl",
          String(local < 0 ? 0 : local > 1 ? 1 : local)
        );
      }

      if (active !== activeIdxRef.current) {
        activeIdxRef.current = active;
        cardRefs.current.forEach((el, i) => {
          if (!el) return;
          el.classList.toggle("fsh-card-active", i === active);
          el.classList.toggle("fsh-card-prev", active >= 0 && i < active);
        });
        tickRefs.current.forEach((row) => {
          row?.forEach((el, j) => {
            if (!el) return;
            el.classList.toggle("is-done", j < active);
            el.classList.toggle("is-current", j === active);
          });
        });
      }

      return animating;
    },
    "pin"
  );

  /* ------------------------------------------------------------ initial */

  useEffect(() => {
    // Paint something as soon as the first frame lands, before any scrolling.
    const img = imgRef.current;
    if (img && !img.getAttribute("src")) img.src = framePath(1);
  }, [framePath]);

  return (
    <div id={id} className={cx("fsh-root", className)}>
      <div
        aria-hidden
        className={cx("fsh-loader", loaderDone && "fsh-loader-done")}
      >
        <div className="fsh-loader-text">
          {loadPct < 100 ? loadingLabel(loadPct) : readyLabel}
        </div>
        <div className="fsh-loader-track">
          <span className="fsh-loader-fill" style={{ width: `${loadPct}%` }} />
        </div>
      </div>

      {/* Tall track. The stage sticks inside it, then releases at the end. */}
      <div
        ref={scrollRef}
        className="fsh-scroll"
        style={{ ["--fsh-scroll-h" as string]: scrollHeight } as React.CSSProperties}
      >
        <div ref={stageRef} className="fsh-stage">
          <div className="fsh-canvas-wrap">
            <img ref={imgRef} alt="" className="fsh-canvas" draggable={false} />
          </div>

          <div className="fsh-copy">
            <h1 className="fsh-title">{title}</h1>
            {subtitle && <p className="fsh-sub">{subtitle}</p>}
          </div>

          <div ref={cardsRef} className="fsh-cards">
            {steps.map((s, i) => (
              <article
                key={s.label}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                style={{ ["--c" as string]: s.color } as React.CSSProperties}
                className="fsh-card"
              >
                <div className="fsh-card-inner">
                  <span aria-hidden className="fsh-card-glow" />
                  <div className="fsh-card-head">
                    <span className="fsh-card-num">
                      <strong>{s.num}</strong> / {s.total}
                    </span>
                    <span aria-hidden className="fsh-card-icon">
                      {s.icon ?? "✦"}
                    </span>
                  </div>
                  <h2 className="fsh-card-title">{s.title}</h2>
                  <p className="fsh-card-desc">{s.description}</p>
                  <div className="fsh-card-foot">
                    <div className="fsh-ticks">
                      {steps.map((tick, j) => (
                        <i
                          key={tick.label}
                          className="fsh-tick"
                          ref={(el) => {
                            (tickRefs.current[i] ??= [])[j] = el;
                          }}
                        >
                          <span />
                        </i>
                      ))}
                    </div>
                    <span className="fsh-card-label">{s.label}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="fsh-progress">
            <span className="fsh-progress-fill" />
          </div>
        </div>
      </div>
    </div>
  );
}
