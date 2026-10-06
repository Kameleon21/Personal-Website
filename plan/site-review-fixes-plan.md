# Site review fixes

Branch: `chore/site-review-fixes` (from Master). Work split across three parallel agents with disjoint files.

## Agent A — SEO / meta / fonts (Layout, config, blog pages, Header)
- [x] `astro.config.mjs` `site` → `https://kameleon21.github.io`
- [x] Per-page canonical + og:url from `Astro.url` / `Astro.site`
- [x] og/twitter image → `/Personal-Website/og-image.png` (built from `site` + BASE_URL)
- [x] `og:type=article` + `article:published_time` on blog posts
- [x] `@astrojs/sitemap` + `@astrojs/rss` (`/rss.xml`), alternate link in head
- [x] Remove duplicate `post.render()` in `blog/[...slug].astro`
- [x] `BASE_URL` instead of hard-coded `/Personal-Website` (Header, blog index)
- [x] `<main>` landmark on homepage and blog posts
- [x] Self-host fonts via @fontsource, drop Google Fonts links

## Agent B — cleanup (assets, data, contact)
- [x] Delete unused `src/assets/*`
- [x] `work.json` becomes the single source for deployments; Hero count derived
- [x] Remove `.contact-tab` dead code, `textContent` for messages
- [x] Consistent readyState init in `Contact.astro`

## Agent C — OG image
- [x] `public/og-image.png` 1200×630 in the system-design-doc style

## Verify
- [x] `bun run build` clean; inspect canonical/og tags in dist; sitemap + rss emitted
- [x] Screenshot homepage + blog post via `bunx astro preview` (port 4323+)
