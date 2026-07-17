# Redesign Personal Website to Match "Developer Portfolio Website" Artifact

## Context

Kamil published a Claude artifact (<https://claude.ai/code/artifact/6adb0931-fec6-4817-bf09-d6e5a5a443e3>) with a new portfolio design and wants the existing Astro site recreated to look like it. The artifact HTML was unpacked (saved at `scratchpad/artifact-template.html`); the full design spec is below. The current site is a dark neo-brutalist mono theme (black `#0A0A0A` / red `#FF2D00` / Space Mono); the new design is a light "system design doc" theme (cream paper, ink borders, hard offset shadows, JetBrains Mono + Space Grotesk).

**User decisions:**

- Blog stays; new nav gets a `/blog` link. Homepage drops the blog section (artifact has none). Blog gets a _minimal token compatibility pass_ only (full blog redesign deferred).
- Contact = artifact's GitHub-PR card **plus** the existing working Web3Forms contact form embedded in it (styled as a PR comment box). ContactTabs is dropped.
- About section and profile photo are dropped (artifact folds identity into hero/experience).

## Design spec (extracted from the artifact)

**Theme:** portfolio presented as an architecture diagram / GitHub PR. Neo-brutalist: 2px ink borders, offset solid shadows, playful monospace annotations.

**Tokens:**

- Paper bg `#f7f5f0` + dot grid `radial-gradient(circle,#d8d4c8 1px,transparent 1px)` / `background-size:22px 22px`
- Ink `#1a1712` · muted `#6b6357` · faint `#8a8578` · dark-header-muted `#b8b2a4` · connector `#3c3a34`
- Accent `#c2401b` (burnt orange); links `a{color:#c2401b}`, hover → ink + underline
- Greens: `#3fdd8f` (status/diff stats), `#2da44e` (GitHub green: checks, merge), diff-row bg `#dafbe1`, code comment `#8b949e`
- Yellow `#f0b429` (HIREABLE), sticky note `#fff8d6` / border `#e8dc9a`
- Fonts (Google): **Space Grotesk** 400/500/700 (body/headings), **JetBrains Mono** 400/500/700 (labels/badges/annotations)
- Card: `#fff; border:2px solid #1a1712; border-radius:12px; box-shadow:4px 4px 0 rgba(26,23,18,.12)`; hover `translateY(-4px)` + `box-shadow:6px 8px 0 rgba(26,23,18,.18)`
- Keyframes: `pulse` (green ring glow, 2.4s, on ● HEALTHY) and `dash` (`background-position-y:-16px`, 1.2s linear infinite, on dashed connectors)
- Layout: `max-width:1100px`, sections `padding:60px 40px`; `html{scroll-behavior:smooth}`

**Sections (homepage, in order):**

1. **Nav** — sticky, `rgba(247,245,240,.92)` + `backdrop-filter:blur(6px)`, 2px ink bottom border. Left: `kamil-system-design.md` (mono 13px bold). Right (mono 12px): `/experience`, `/projects`, `/stack` (+ `/blog` per user), hover = ink bg / cream text / radius 6; CTA `POST /contact` orange bg, white, bold, radius 6, shadow `3px 3px 0 rgba(26,23,18,.2)`, hover ink. Anchor links scroll smoothly (offset ~-60px).

2. **Hero diagram** — meta row (mono 11 faint): `// system design doc · last deploy: {today YYYY-MM-DD}` / `click any node to zoom in ↓`. Relative container ~470px (desktop):
   - Root node (center top): dark card (`#1a1712`, cream text, radius 12, pad 22/44, shadow 6px 6px 0): **KAMIL ROGOZINSKI** (30px/700/-0.5px), sub `core service · software engineer @ Citi Dublin · v25.9` (mono 11, #b8b2a4), pills (mono 10/700/radius 999): `● HEALTHY` green + pulse, `HIREABLE` yellow, `JAVA · GO · TS` cream.
   - Animated dashed drop → solid bus line (left/right 14%, top 180) → three vertical drops → three clickable 230px white cards at 14%/50%/86% (top 210): orange mono 9px label (`SVC / EXPERIENCE|PROJECTS|STACK`), bold 17px title (`Citi Dublin` / `3 deployments` / `Polyglot`), 12.5px muted desc (`Spring Boot APIs · Angular · Docker / OpenShift · mentoring` / `Oku (Go TUI) · FirstDevJob · CE Equipment` / `Java · Go · TypeScript · MySQL · CI/CD`), mono 10px footer `GET /experience →` etc. Hover lift; click scrolls to section.
   - Dashed drop → orange CTA node (`→ POST /contact` + `202 Accepted · replies fast`), hover scale 1.03, scrolls to contact.
   - Sticky note top-right (rotate 3deg, #fff8d6): "note: single point of failure — hire him before someone else does". White note bottom-left (rotate −2deg): `deps: coffee ☕ / uptime: since 2001 / region: waterford, ie`.
   - **Mobile (<768px):** absolute layout collapses — stack root node, three service cards, and CTA vertically with short dashed connectors between; hide bus lines and notes (or show notes inline below).

3. **Experience** (`id="experience"`) — shared section-header pattern: baseline flex row, 2px ink bottom border: orange mono 11px label + 28px/700 title + right mono 11px faint note. Here: `SVC / EXPERIENCE` / **Deploy history** / `0 incidents · 0 rollbacks`. Grid `1.35fr 1fr` gap 20:
   - Left diff card: dark header `experience/citi-dublin.java` + green `+412 −0`; body: **Software Engineer — Citi Dublin** (19px) + `2025.09 → now`; 5 diff rows (mono 12.5, lh 2, bg #dafbe1, radius 4, green `+`):
     ships Spring Boot REST services across multiple apps / builds modular Angular front-end components / designs MySQL schemas for query efficiency / deploys via Docker + OpenShift, improves CI/CD / `mentors(intern)` + grey comment `// onboarding, reviews, guidance`
   - Right stack: card **SWE Intern — Citi Dublin** `2024.06 → 12` "Java + .NET, APIs and microservices, Agile teams, code reviews. Converted to full-time."; card **BSc (Hons) Software Systems** `2022 → 25` "SETU Waterford — First Class Honours (1.1)."; mono footnote `// languages: Polish (native) · English (fluent)`.

4. **Projects** (`id="projects"`) — header: `SVC / PROJECTS` / **Deployments** / `source available — review the code yourself`. 3-col grid of terminal cards: dark title bar (green 8px dot + repo + right kind), body (name 20px/700, desc 13.5px muted flex-1, tag pills mono 10px 1px-ink-border radius 999, orange mono link). Hover lift.
   - `oku/` open source — **Oku** — "A book tracker that lives in your terminal. Manage a Hardcover reading library with lazygit-style modal panels, discovery search across books, authors and genres, and density modes. Built for devs who live in tmux." [Go, Bubble Tea, Lip Gloss, TUI] `view source →`
   - `firstdevjob/` platform — **FirstDevJob** — "The job board Ireland's junior devs were missing. Curated listings that link straight to applications — no account needed to browse. Anonymous submissions, Google OAuth via Clerk, email notifications, audit trails." [TypeScript, Clerk, OAuth, Full-stack] `view source →`
   - `ce-equipment/` client work — **CE Equipment** — "B2B consulting website built for speed. Responsive, high-performance and maintainable — deployed and optimised for fast load times using modern web practices." [Astro, React, Tailwind] `case study →`
   - Artifact links are placeholder `github.com/Kameleon21`; use the real `link`/`githubLink` values from `src/data/work.json` (entries: OKU, FirstDevJob, CE Equipment Solutions).

5. **Stack** (`id="stack"`) — header: `SVC / STACK` / **All checks have passed** / `14 / 14 required checks`. 4-col grid (2-col mobile) of chips: white card radius 10, shadow 3px 3px 0, 20px green `#2da44e` ✓ circle + mono 12.5/500 skill. Skills: Java, Spring Boot, Go, TypeScript, JavaScript, Angular, Python, MySQL, REST APIs, Docker, OpenShift, Git, CI/CD, Agile.

6. **Contact** (`id="contact"`) — PR card (radius 14, shadow 6px 6px 0): dark header: green pill `⎇ Open` + **Merge Kamil into your team** `#2026` + right green mono `+8,542 skills · −0 red flags`. Body: green ✓ circle + **All checks have passed — no conflicts with your team** + sub `BSc (Hons) 1.1 · 2 yrs at Citi · 3 shipped projects · fluent EN / PL`; buttons: `GitHub` / `LinkedIn` (mono 12, 2px ink border radius 8, hover invert) + **Merge — get in touch** (green bg, mailto:kamilrogozinski29@gmail.com, shadow 3px 3px 0, hover ink). Links: github.com/Kameleon21, linkedin.com/in/kamil-rogozinski/.
   - **Plus (user decision):** embed the existing Web3Forms contact form inside the PR card below the checks row, styled as a GitHub "Write a comment" box (ink-bordered inputs on white, mono labels, green submit). Reuse `src/scripts/contact-form.ts` unchanged.
   - Footer row (mono 11 faint, space-between): `© {year} kamil rogozinski · waterford, ireland` / `// built different, deploys the same`.

## Implementation

Stack stays: Astro 5 + Tailwind v3 + vanilla TS. Use Bun for all commands. Keep `base: "/Personal-Website/"` and the existing hardcoded `/Personal-Website/...` link convention.

### 1. Tokens — `tailwind.config.mjs` + `src/styles/global.css`

- Add new palette under `theme.extend.colors` (e.g. `paper`, `ink`, `muted`, `faint`, `accent`, `ghgreen`, `mint`, `diff`, `note`); **keep the `brutal` palette** so untouched blog CSS keeps compiling.
- Fonts: `sans: ['"Space Grotesk"', system-ui]`, `mono: ['"JetBrains Mono"', monospace]` (blog inherits JetBrains Mono — fine). Drop Instrument Serif.
- `global.css`: add `@keyframes pulse` + `@keyframes dash`, component classes for the repeated patterns (`.node-card` white ink-border card + hover lift, `.dark-bar` card header, `.section-head`, `.pill`), dot-grid background utility, dashed-connector utility. Update `::selection`, scrollbar, and `:focus-visible` colors to accent/ink. Keep existing `.brutal-*`, `.reveal`, `.noise` classes for blog compatibility (no longer used on homepage).
- Update the custom `typography.brutal` prose vars in `tailwind.config.mjs` from dark-theme colors to the new light palette (ink text on paper) — this is the bulk of the blog compatibility pass.

### 2. `src/layouts/Layout.astro`

- Swap Google Fonts links → Space Grotesk (400;500;700) + JetBrains Mono (400;500;700).
- Body: `bg-paper text-ink font-sans` + dot-grid background; remove `.noise` overlay and `.grid-overlay` div; keep `BackToTop` (restyle to ink/accent).
- Keep the reveal IntersectionObserver script (harmless; blog may use it), update `theme-color`/OG meta.

### 3. Components

- **`Header.astro`** — rewrite: sticky translucent cream nav per spec; links `/experience /projects /stack` (hash links to `/Personal-Website/#...`), `/blog` → `/Personal-Website/blog`, CTA `POST /contact`. Keep the hamburger + `initMobileMenu` (`src/scripts/header.js`) for mobile, restyled (cream panel, ink borders); drop the scroll-spy script.
- **`Hero.astro`** — rewrite as the system diagram (desktop absolute layout exactly per spec; mobile stacked flow via media queries). `today` computed at build time (`new Date().toISOString().slice(0,10)`) — static is fine.
- **`Experience.astro`** (new) — diff card + side cards, content hardcoded per spec.
- **`MyWork.astro`** — rewrite as "Deployments": three cards with artifact copy hardcoded, real URLs read from `src/data/work.json` (match by title: OKU, FirstDevJob, CE Equipment Solutions). Drop images/videos/glob logic.
- **`Stack.astro`** (new) — checks grid, skills array in frontmatter.
- **`Contact.astro`** — rewrite as PR card; embed restyled `ContactForm.astro` (new input styles on white; keep field names, hidden `access_key`, `botcheck`, and `initContactForm` wiring). Delete ContactTabs usage.
- **`Footer.astro`** — rewrite to the single mono footer row (blog pages share it — fine).
- **`src/pages/index.astro`** — compose: Header, Hero, Experience, MyWork(Deployments), Stack, Contact, Footer. Remove About, Blog section, ScrollProgress.
- Delete: `About.astro`, `Blog.astro`, `ContactTabs.astro`, `ScrollProgress.astro` (and hamburger.css only if the mobile menu no longer needs it).

### 4. Blog compatibility pass (minimal)

- `src/pages/blog/index.astro` + `src/layouts/BlogPost.astro`: keep structure; adjust classes that assume the dark body (`bg-brutal-black`, `text-brutal-white`) so pages read correctly on the new cream body; prose colors come from the updated `typography.brutal` vars. Blog cards: reuse `.node-card` style. Full blog redesign deferred.

### 5. Cleanup

- `src/styles/global.css`: after homepage rewrite, drop clearly dead homepage-only effects (ticker-strip, section-scan) if nothing references them.

## Verification

1. `bun run build` — clean build, no missing-class/import errors.
2. `bunx astro preview` → check `/Personal-Website/` and `/Personal-Website/blog/`:
   - all six homepage sections render per spec; nav + hero nodes scroll to the right anchors; hover lifts and both animations run.
   - Screenshot desktop (1280w) and mobile (390w) and compare against the artifact.
3. Contact form: submit with honeypot empty → expect Web3Forms success state (or verify the fetch fires with correct payload without actually spamming — check network call shape).
4. Blog listing + one post render legibly on the light theme.
5. Reduced-motion: animations disabled via existing `prefers-reduced-motion` block.

Copy this plan to `plan/artifact-redesign-plan.md` in the repo when implementation starts (project convention).
