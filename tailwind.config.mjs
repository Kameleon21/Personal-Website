/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        paper: "#f7f5f0",
        ink: "#1a1712",
        muted: "#6b6357",
        faint: "#8a8578",
        accent: "#c2401b",
        mint: "#3fdd8f",
        ghgreen: "#2da44e",
        diffbg: "#dafbe1",
        connector: "#3c3a34",
        inkmuted: "#b8b2a4",
        note: "#fff8d6",
        noteline: "#e8dc9a",
        hire: "#f0b429",
        dot: "#d8d4c8",
        brutal: {
          black: "#0A0A0A",
          white: "#F5F0EB",
          red: "#FF2D00",
          grey: "#888888",
          rule: "#333333",
        },
      },
      fontFamily: {
        sans: ['"Space Grotesk"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      boxShadow: {
        "offset-sm": "3px 3px 0 rgba(26,23,18,.2)",
        offset: "4px 4px 0 rgba(26,23,18,.12)",
        "offset-lg": "6px 6px 0 rgba(26,23,18,.15)",
        "offset-hover": "6px 8px 0 rgba(26,23,18,.18)",
        chip: "3px 3px 0 rgba(26,23,18,.1)",
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
            "--tw-prose-body": "#1a1712",
            "--tw-prose-headings": "#1a1712",
            "--tw-prose-lead": "#6b6357",
            "--tw-prose-links": "#c2401b",
            "--tw-prose-bold": "#1a1712",
            "--tw-prose-counters": "#6b6357",
            "--tw-prose-bullets": "#c2401b",
            "--tw-prose-hr": "#d8d4c8",
            "--tw-prose-quotes": "#1a1712",
            "--tw-prose-quote-borders": "#c2401b",
            "--tw-prose-captions": "#8a8578",
            "--tw-prose-code": "#c2401b",
            "--tw-prose-pre-code": "#f7f5f0",
            "--tw-prose-pre-bg": "#1a1712",
            "--tw-prose-th-borders": "#d8d4c8",
            "--tw-prose-td-borders": "#d8d4c8",
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
