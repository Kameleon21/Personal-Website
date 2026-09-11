# Add Tokenlens project + clean up UI branches

- [x] Prune worktrees and delete local UI branches (`ui/kbd-three`, `codex/keyboard-portfolio`)
- [x] Delete merged remote UI branches (`ui/reformat`, `ui/system-design-redesign`)
- [x] Branch `content/tokenlens` off Master
- [x] Add Tokenlens to `src/data/work.json`
- [x] Add Tokenlens deployment card in `MyWork.astro`, adjust grid for 4 cards
- [x] Update Hero projects node (count + summary line)
- [x] Build and screenshot to verify layout at desktop and mobile

## Review

- Tokenlens added as the first deployment card (newest first); links pull from `work.json` like the others.
- Grid is `sm:grid-cols-2 xl:grid-cols-4`: 4-up only at ≥1280px, where cards are ~240px wide. At 1024px, 4-up wrapped the `ce-equipment/` bar label, so that range is 2×2.
- Hero projects node: `4 deployments`, summary line lists Tokenlens; contact banner says 4 shipped projects.
- Verified: `bun run build` clean, headless-Chrome screenshots at 1280 / 1024 / 520.
- Branch cleanup: deleted local `ui/kbd-three` (no changes) and `codex/keyboard-portfolio` (was 1030275, recoverable from reflog); deleted remote `ui/reformat`, `ui/system-design-redesign` (both merged into Master). `origin/content/ai-threat-model-post` left alone (content, not UI).
