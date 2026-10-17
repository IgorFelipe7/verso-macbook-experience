# MacBook Neo — Product Experience

An independent product-page concept built around a scroll-controlled image sequence. The project explores how to connect a visual narrative with responsive layouts, device-aware loading and reduced-motion support.

## The experience

As the visitor scrolls, the MacBook rotates, opens and moves through five colorways. A frame sequence drives the main stage, followed by editorial sections and product details that reuse crops from the same source images.

The implementation uses React, TypeScript and Vite. Scroll behavior is coordinated through a shared ticker and a requestAnimationFrame loop.

## Engineering decisions

- **Shared scroll state.** Sections use one scroll listener and one rendering loop to coordinate their progress.
- **Direct visual updates.** Scroll progress updates CSS custom properties instead of sending every animation frame through React state.
- **Staged frame loading.** A concurrency-limited queue prioritizes frames around the current scroll position. Coarser sampling on constrained devices reduces the amount of decoded image data needed at once.
- **Content-driven composition.** Frame numbers, product copy and crop coordinates live in a shared content module, so editorial changes can be made in one place.
- **Reduced-motion presentation.** The alternative path keeps content visible in a static layout when the visitor prefers less movement.

These choices address rendering and loading costs. Their performance still depends on the device, browser, assets and scroll conditions used for evaluation.

## Stack

- **React 19** + **TypeScript** — strict, no `any`, no ambient escape hatches
- **Vite** — dev server and build
- **Tailwind CSS v4** — token layer only; the scroll experience is hand-written CSS
- **shadcn-style project conventions** — `@/components/ui`, `@/lib`, `@/hooks`, path-aliased imports
- **lucide-react** — the only runtime icon dependency
- Zero animation libraries. Zero video files. Zero external asset hosts.

## Architecture

```
src/
├── components/
│   ├── ui/
│   │   └── mac-book-neo-hero.tsx      the frame-sequence hero primitive
│   └── product/                        page composition
│       ├── product-experience.tsx      root: assembles the full page
│       ├── site-nav.tsx                fixed nav, active-section aware
│       ├── editorial-statement.tsx     "Act Two" opening statement
│       ├── product-highlights.tsx      asymmetric highlights grid
│       ├── scroll-feature.tsx          reusable pinned product moment
│       ├── final-product-cta.tsx       closing scene
│       ├── site-footer.tsx
│       ├── scene-image.tsx             a still, cropped from the sequence
│       └── verso-signature.tsx
├── content/
│   └── product.ts                      every string, frame number, and
│                                        crop coordinate — single source
│                                        of truth for the page's content
├── lib/
│   ├── scroll-ticker.ts                the shared scroll/rAF loop
│   ├── frame-loader.ts                 staged, device-aware frame queue
│   └── utils.ts
└── hooks/
    ├── use-section-progress.ts         imperative scroll progress, no re-renders
    ├── use-active-section.ts           IntersectionObserver-based nav state
    └── use-reduced-motion.ts
```

Changing what the page says or which frame a section borrows means editing `content/product.ts`. It never means touching a component.

## Running it

```bash
npm install
npm run dev
```

```bash
npm run build      # type-check + production build
npm run lint        # oxlint
npm run preview     # serve the production build locally
```

The image sequence lives in `public/sequence/frame_0001.jpg` … `frame_0941.jpg` and is served as static assets — no CDN, no external host, no build-time processing.

## Validation and performance review

The package defines lint, type-check/build and preview commands. It does not currently define an automated test script.

For a review, run the production build and check:

1. Forward and backward scrolling, resizing and loading partway through the page.
2. Frame loading on slower connections and devices with limited memory.
3. Keyboard navigation and the reduced-motion presentation.

Use React Profiler and browser performance tools to measure rendering, long tasks and memory on the target devices. When sharing a benchmark, include the commit, device, browser, viewport and exact interaction. Treat timing and memory results as measurements for that setup rather than universal guarantees.

## License

Proprietary. All rights reserved.
