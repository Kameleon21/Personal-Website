# Repository Guidelines

## Project Structure & Module Organization
Source lives in `src/`, with feature areas split into `components/`, `layouts/`, `pages/`, and `styles/`. Assets that must ship verbatim belong in `public/`; processed assets sit under `src/assets/`. Helper data and utilities live in `src/data/` and `src/utils/`. Generated builds are emitted to `dist/` and should not be committed. Use `scripts/new-post.js` to scaffold Markdown entries into `src/content/` to keep blog metadata consistent.

## Build, Test, and Development Commands
`npm run dev` launches Astro’s dev server with hot reloading at `http://localhost:4321`. `npm run build` performs a production build and surfaces type errors. `npm run preview` serves the last build for smoke testing. `npm run astro -- check` runs Astro’s static analysis and should stay green before merging. `npm run new-post` creates a timestamped blog post template; rename or relocate only after frontmatter edits.

## Coding Style & Naming Conventions
Follow two-space indentation across Astro, TypeScript, and JSON files. Name Astro components and layouts in PascalCase (e.g., `HeroSection.astro`), utilities in camelCase, and Markdown posts using `yyyy-mm-dd-title.md`. Prefer Tailwind utility classes over bespoke CSS; shared styles belong in `src/styles/global.css`. Keep imports sorted by origin (npm, then relative) to match existing files.

## Testing Guidelines
The project currently relies on manual and build-time checks. Always run `npm run build` and open `npm run preview` to verify layouts, metadata, and Lighthouse scores. When adding new visuals, include responsive screenshots or notes in the PR. For scripts, add usage examples or unit coverage in a colocated `*.test.ts` if you introduce testing tooling; skip committing temporary mocks.

## Commit & Pull Request Guidelines
Recent history favors concise, lowercase commit prefixes such as `feat:` or `update`. Write imperative summaries under 72 characters and push follow-up fixes as `fix:` or `chore:`. Every PR should describe motivation, list key changes, and link related issues or design notes. Provide before/after screenshots for visual tweaks and mention any new commands, env vars, or migration steps so reviewers can reproduce locally.
