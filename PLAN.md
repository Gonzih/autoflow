# PLAN — autoflow landing site + HyperFrames demo

## Task restatement
Build a Vite + React + Tailwind CSS v4 landing site for autoflow at the repo root, plus a 45-second HyperFrames demo video (4 scenes showing the photo-to-squarespace pill), then deploy config + PR merge.

## Approaches considered

### A. Site at repo root (chosen)
- package.json + vite.config.ts at root, `src/` for React components, `public/` for static assets
- Render command `--output public/autoflow-demo.mp4` works without path adjustments
- Trade-off: mixes pill docs with site tooling — acceptable since pills are clearly in `pills/`

### B. Site in `site/` subdirectory
- Cleaner separation of concerns
- Trade-off: render output path would need adjustment to `site/public/autoflow-demo.mp4`; vercel.json needs `rootDirectory: "site"`

### C. Next.js instead of Vite
- SSR capabilities, better DX
- Trade-off: overkill for a static landing page; Tailwind v4 + Vite is explicitly requested

## Chosen approach: A (site at root)
Matches the render command exactly. Vite will serve `public/` as static assets. The pills/ and schema/ dirs are unaffected.

## Files to create/modify
- `package.json` — Vite + React + TS + Tailwind v4 + types
- `vite.config.ts`
- `tsconfig.json`, `tsconfig.node.json`
- `index.html` — Vite entry point
- `.gitignore` — node_modules, dist, etc.
- `src/main.tsx`
- `src/App.tsx`
- `src/index.css` — Tailwind v4 + @theme custom colors + Google Fonts
- `src/components/Hero.tsx`
- `src/components/HowItWorks.tsx`
- `src/components/PillsLibrary.tsx`
- `src/components/DemoSection.tsx`
- `src/components/Footer.tsx`
- `hyperframes-demo/index.html` — 45s composition (init via npx hyperframes)
- `public/autoflow-demo.mp4` — rendered video
- `vercel.json` — deploy config
- `PLAN.md` (this file)
- `TODO.md`

## HyperFrames composition design (45s, 4 scenes)
- Scene 1 (0–10s): Problem statement — 3 fade-in text lines
- Scene 2 (10–22s): Drop your inputs — file list (left) + instruction (right)
- Scene 3 (22–37s): Agent runs — terminal lines staggered + progress bar
- Scene 4 (37–45s): Output — CSV preview + result text + footer

All clip elements: class="clip" + data-start (absolute) + data-duration + data-track-index
GSAP: timeline { paused: true }, registered as window.__timelines["autoflow-demo"]
No Math.random, Date.now, fetch, inline transforms on GSAP elements

## Risks and unknowns
- HyperFrames `--input` flag: may or may not exist; will adjust if needed
- `--width` / `--height` render flags: undocumented in skill — try and handle errors
- Google Fonts in Puppeteer: network accessible in draft render; system font fallbacks included
- Render time: 45s video at draft quality likely 2–3 minutes; plan for it
