// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";
import { remarkBaseUrl } from "./src/lib/markdown.ts";

const base = "/Personal-Website/";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: true,
    }),
    icon(),
    sitemap(),
  ],
  markdown: {
    remarkPlugins: [[remarkBaseUrl, { base }]],
    shikiConfig: {
      theme: "dracula",
      wrap: true,
    },
  },
  site: "https://kameleon21.github.io",
  base,
});

