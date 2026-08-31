# MacBook Neo — Product Experience

A cinematic, scroll-driven product page built around a 941-frame image sequence. No video file, no animation library — just images, a scroll position, and a render loop tuned until it feels inevitable.

---

## What this is

Most "scroll hijack" product pages either fake the smoothness with CSS transitions that stutter under real scroll speed, or brute-force it with a heavy animation library that ships 80KB of runtime for something a `requestAnimationFrame` loop does in twelve lines. This is neither.

The page opens on a MacBook that rotates, opens, and cycles through five colorways as you scroll — driven frame-by-frame from a local image sequence, eased toward the scroll position rather than snapped to it. When the sequence ends, the pinned stage releases on its own scroll math and hands off into an editorial page built from the same design tokens: a statement section, an asymmetric highlights grid, three scroll-pinned product moments cropped from the same source frames, and a closing scene that mirrors the opening.

Nothing here is a mockup. Every visual after the hero is a real crop of a real frame from the sequence — no stock photography, no placeholder assets.

## Engineering notes

**One scroll listener, one render loop, for the entire page.** Every scroll-linked section — the hero, the statement reveal, the highlights grid, the three product moments, the closing scene — subscribes to a single shared ticker instead of registering its own `scroll` handler. N sections cost one passive listener and one `requestAnimationFrame` callback, not N of each.

**Scroll drives styles directly, never React state.** Progress is written straight to CSS custom properties on the DOM node. Scrolling this page produces zero component re-renders — verified under a synthetic 6000px scroll sweep at p99 latency under 18ms with zero long tasks.

**The frame loader adapts to the device, not just the network.** A concurrency-capped queue fetches frames outward from the current scroll position — forward-biased, because that's where the reader is heading — instead of firing 941 requests at once. On coarse-pointer or memory-constrained devices it silently switches to a coarser stride and lets the nearest-loaded frame stand in, which is invisible at real scrubbing speed and roughly halves the decoded-bitmap footprint.

**Frame composition is measured, not eyeballed.** The editorial crops (the highlights grid, the three scroll-pinned moments) are positioned from the actual pixel bounding box of the product within each source frame, computed once and hard-coded as content data — not guessed by hand at one breakpoint and hoped for at the rest.

**Reduced motion is a first-class rendering path, not a hidden section.** Every scroll-revealed element ships a `prefers-reduced-motion` fallback that resolves to fully visible, static content — the complete narrative, just without the travel. Nothing is stripped out for accessibility; it's re-rendered for it.

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

## Performance budget

- Scroll-linked updates: **direct style writes**, not state — zero React commits while scrolling
- Frame requests: **concurrency-capped**, prioritized around the scroll position
- Long tasks during a full-page scroll sweep: **zero**
- Every animated property is `transform` / `opacity`; nothing scroll-linked touches layout
- `IntersectionObserver` for anything that only needs to know *if* it's visible; `requestAnimationFrame` reserved for anything that needs to know *how much*

## License

Proprietary. All rights reserved.
