# Deepen modules: see plan/deepen-modules-plan.md

- [x] Branch off Master and snapshot the baseline build
- [x] A: Profile + Project collection
- [x] B: Career trace time axis
- [x] C: Routes + Post modules
- [x] Integration: profile facts in Experience and the 404 page
- [x] Verify: bun test, build, dist link check, screenshot diff
- [x] PR

## Review

- 60 tests across 7 files (`bun test`), run in CI before every build; PRs now build + test without deploying.
- Visible-text diff vs baseline: only Tramly's fake shell lines → "iPhone recording", and contact "4" → "5 shipped projects".
- Link check of `dist`: 170 internal URLs, the only misses are the 404 page's own canonical (same as baseline).
- Screenshots checked: Tramly device card, 404 (5 deployments · v25.9), oku post images under base.
- Left as-is (minor): media check resolves from cwd; client trace ignores `durLabel` for running spans (none have one).
