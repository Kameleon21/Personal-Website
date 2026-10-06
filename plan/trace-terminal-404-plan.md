# Trace timeline, terminal playback, 404 — prototype round

Branch: `ui/trace-terminal-404`. Same flow as the live-wire hero: prototype variations first, Kamil picks, then implement.

## 1. Terminal playback for TUI projects
- Record real sessions with VHS: `tokenlens --demo` (synthetic data, safe to publish) and `oku` (real Hardcover library, read-only navigation only — confirm before publishing).
- Output webm + mp4 + poster frame, small enough for GitHub Pages (target < 1.5 MB each).
- Show inside the project cards as a terminal window; plays when in view, paused with reduced motion.

## 2. Experience as a trace waterfall
- Root span `kamil.career`, child spans `setu.bsc` (2022→2025), `citi.intern` (2024.06→2024.12), `citi.swe` (2025.09→now) on a shared time axis.
- Hover/focus a span → attributes panel (stack, highlights from current Experience.astro copy).
- 3 variations in the prototype; mobile stacks spans vertically.

## 3. Custom 404
- "404 · service not found": a dead node with a severed cable, retry → home.

## Steps
- [x] Record VHS tapes (scratch: /tmp/ui-proto/rec)
- [x] Prototype page with trace variations + terminal card + 404 (scratch: /tmp/ui-proto)
- [x] Kamil picked A1 (Jaeger), B1 (autoplay cards), C1 (severed cable); Oku re-recorded on neutral mock data
- [x] Implement in Experience.astro, MyWork.astro, src/pages/404.astro
- [x] Build, preview screenshots desktop + ≥500px mobile
