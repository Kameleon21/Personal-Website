# Artifact redesign — todo

Plan: `plan/artifact-redesign-plan.md`

- [x] Tokens: tailwind.config.mjs (palette, fonts, shadows, light prose theme)
- [x] global.css: light base, dot grid, keyframes (pulse/dash), retoned component classes
- [x] Layout.astro: fonts swap, cream body, drop noise/grid overlay
- [x] Header.astro: sticky system-doc nav + mobile menu restyle
- [x] Hero.astro: system diagram (desktop absolute + mobile stacked) + landing pulse cascade + draggable notes
- [x] Experience.astro (new): diff card + side cards
- [x] MyWork.astro: "Deployments" terminal cards (real links from work.json)
- [x] Stack.astro (new): checks grid
- [x] Contact.astro + ContactForm.astro: PR card + comment-style form
- [x] Footer.astro: mono footer row
- [x] index.astro: recompose; deleted About/Blog/ContactTabs/ScrollProgress/BlogCard
- [x] Blog compatibility pass (listing + post layout + shared bits)
- [x] Verify: build clean, desktop 1280 + mobile screenshots match artifact

## Review

- Root cause of an early layout bug: body is `flex flex-col`, and `mx-auto` on a flex
  item cancels cross-axis stretch, so sections collapsed to fit-content. Fixed by
  adding `w-full` to every `max-w-[1100px] mx-auto` section.
- Mobile "overflow" during verification was a headless-Chrome artifact (window
  clamps to ~500px while the screenshot canvas stays 390) — real layout is fluid.
- Full blog redesign deferred; blog got a light-theme token pass only.
