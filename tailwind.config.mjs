/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        primary: "#0A0A0B",
        secondary: "#141416",
        tertiary: "#1C1C1F",
        // Accent - Electric Teal
        accent: {
          DEFAULT: "#2DD4BF",
          dim: "#14B8A6",
          glow: "rgba(45, 212, 191, 0.15)",
          "glow-strong": "rgba(45, 212, 191, 0.3)",
        },
        // Text
        text: {
          primary: "#F4F4F5",
          secondary: "#A1A1AA",
          muted: "#71717A",
        },
        // Borders
        border: {
          DEFAULT: "#27272A",
          accent: "rgba(45, 212, 191, 0.3)",
        },
      },
      fontFamily: {
        sans: ["Satoshi", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        display: ["JetBrains Mono", "monospace"],
      },
      backgroundColor: {
        primary: "#0A0A0B",
        secondary: "#141416",
        tertiary: "#1C1C1F",
      },
      textColor: {
        primary: "#F4F4F5",
        secondary: "#A1A1AA",
        muted: "#71717A",
      },
      borderColor: {
        DEFAULT: "#27272A",
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
        invert: {
          css: {
            "--tw-prose-body": "#A1A1AA",
            "--tw-prose-headings": "#F4F4F5",
            "--tw-prose-lead": "#A1A1AA",
            "--tw-prose-links": "#2DD4BF",
            "--tw-prose-bold": "#F4F4F5",
            "--tw-prose-counters": "#71717A",
            "--tw-prose-bullets": "#71717A",
            "--tw-prose-hr": "#27272A",
            "--tw-prose-quotes": "#F4F4F5",
            "--tw-prose-quote-borders": "#2DD4BF",
            "--tw-prose-captions": "#71717A",
            "--tw-prose-code": "#2DD4BF",
            "--tw-prose-pre-code": "#F4F4F5",
            "--tw-prose-pre-bg": "#141416",
            "--tw-prose-th-borders": "#27272A",
            "--tw-prose-td-borders": "#27272A",
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
