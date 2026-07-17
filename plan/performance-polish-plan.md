# Performance Polish Plan

## Goal

Reduce visual clunkiness while keeping the existing brutalist style and structure.

## Checklist

- [x] Replace high-cost/stepped animations with smoother transform/opacity-based transitions
- [x] Add reduced-motion fallbacks for users and low-power devices
- [x] De-optimize expensive fixed overlays to lower paint cost
- [x] Improve mobile menu animation path (avoid `clip-path` transitions)
- [x] Improve reveal observer initialization and guard against duplicate setup
- [x] Run production build to validate no regressions
