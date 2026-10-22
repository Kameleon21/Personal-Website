# Deepen modules (architecture review 2026-10-22)

Branch: `refactor/deepen-modules` off Master (eba116e). Baseline build: `/tmp/dist-baseline`.

Conventions: pure logic lives in `src/lib/*.ts` with no `astro:` imports, so `bun test` can load it.
Tests sit next to the module as `*.test.ts`. Run them with `bun test`.

## Streams (run in parallel, each owns its own files)

- **A: Profile + Project collection (#1, #2).** `work.json` becomes a `projects` data collection
  with a zod schema: demo kind `terminal | device`, media paths derived, a build-time check that the
  media files exist. `src/lib/profile.ts` holds the facts and the derived values (project count,
  Citi tenure, summary line). Owns: `content/config.ts`, `data/*`, MyWork, Hero, Contact, Stack,
  `terminal-demos.ts`.
- **B: Career trace time axis (#3).** `src/lib/trace.ts` holds domain, now (clamped), pct, duration
  and the derived header stats, used by both the Experience frontmatter and `career-trace.ts`. The
  spans move into a data module. Owns: Experience, `career-trace.ts`.
- **C: Routes + Post modules (#4, #5).** `src/lib/routes.ts` holds the route list and href builder,
  used by Header, 404, `not-found.ts`, blog and rss. Markdown hrefs stop hardcoding
  `/Personal-Website`. `src/lib/posts.ts` holds sort, URL, OG image and reading time. Per-post OG
  images get wired up, and `new-post.js` is fixed. Owns: `astro.config.mjs`, Layout, Header, 404
  links, `not-found.ts`, `pages/blog/*`, rss, BlogPost, `scripts/new-post.js`, `content/blog/*`,
  `utils/*`.
- **Integration (lead):** profile facts move into Experience and the 404 page. Verify with
  `bun test`, a build, a link check of the built `dist`, and screenshots against `/tmp/dist-baseline`.

## Done when

- `bun test` passes and `bun run build` is clean
- every internal href and src in `dist` resolves under `/Personal-Website/`
- the pages look the same as baseline, apart from the intended fixes (project count, Tramly
  device chrome)
