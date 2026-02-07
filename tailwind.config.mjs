/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        brutal: {
          black: "#0A0A0A",
          white: "#F5F0EB",
          red: "#FF2D00",
          grey: "#888888",
          rule: "#333333",
        },
      },
      fontFamily: {
        mono: ['"Space Mono"', "monospace"],
        serif: ['"Instrument Serif"', "serif"],
      },
      typography: {
        DEFAULT: {
          css: {
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
          },
        },
        brutal: {
          css: {
            "--tw-prose-body": "#F5F0EB",
            "--tw-prose-headings": "#F5F0EB",
            "--tw-prose-lead": "#888888",
            "--tw-prose-links": "#FF2D00",
            "--tw-prose-bold": "#F5F0EB",
            "--tw-prose-counters": "#888888",
            "--tw-prose-bullets": "#FF2D00",
            "--tw-prose-hr": "#333333",
            "--tw-prose-quotes": "#F5F0EB",
            "--tw-prose-quote-borders": "#FF2D00",
            "--tw-prose-captions": "#888888",
            "--tw-prose-code": "#FF2D00",
            "--tw-prose-pre-code": "#F5F0EB",
            "--tw-prose-pre-bg": "#111111",
            "--tw-prose-th-borders": "#333333",
            "--tw-prose-td-borders": "#333333",
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
