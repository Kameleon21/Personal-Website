# Drag-based sketch hero — Live wire

Plan: `plan/drag-sketch-variations-plan.md`
Prototype (3 variations): https://claude.ai/code/artifact/1071f876-e139-42e6-957b-02d319c710cb

- [x] Read current hero, tokens, lessons
- [x] Build interactive prototype page with 3 variations (Whiteboard / Blueprint / Live wire)
- [x] Kamil picked **Live wire**
- [x] `src/scripts/hero-canvas.ts`: drag controller (4px click threshold, keyboard nudge), spring physics (edge + home springs, fling, soft bounds), cable routing, health pulses, chaos monkey, reset
- [x] `src/components/Hero.astro`: SVG cables + pulses in the template, nodes keep CSS base position and get `--dx/--dy` deltas, pinned notes, status line on service cards, chaos/reset buttons in the meta row, cable draw-in replaces the old signal-drop/bus-flash cascade
- [x] Verify: `bun run build` clean; headless-Chrome DevTools script (scratchpad `cdp-test.ts`) drags the projects card → contact + root are tugged, release settles, no navigation on drag, plain click navigates to `#experience`, chaos flips root to DEGRADED and back, reset zeroes every delta, no console errors from the hero
- [ ] Commit (not requested yet)

## Review

- Service cards grew ~26px with the health line, which put the projects card's bottom level with the contact node's top and made the cable route sideways. Fixed by stage 470→500px, contact node 392→420px, deps note bottom 30→22px, and a smaller minimum cable sag. Same fix applied to the prototype.
- When two boxes overlap on both axes the side-anchor routing looped behind them; overlapping boxes now plug straight through vertically.
- Node positions stay CSS-driven (`left/top` + `--tx`), the script only adds a delta, so the no-JS state is the plain static layout and resizing needs no bespoke logic.
- Pre-existing, unrelated: `images/og-image.jpg` referenced by the OG meta tags 404s.
