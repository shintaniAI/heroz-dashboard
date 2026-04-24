import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#FAFAF7",
        paper: "#FFFFFF",
        ink: {
          DEFAULT: "#0A0A0A",
          2: "#262626",
          3: "#525252",
          4: "#737373",
          muted: "#A3A3A3",
        },
        line: {
          DEFAULT: "#E7E5E4",
          soft: "#F0EEEB",
          strong: "#D6D3D1",
        },
        accent: {
          DEFAULT: "#0D7D72",
          soft: "#E6F4F1",
          ink: "#064E47",
        },
        ok: {
          DEFAULT: "#047857",
          soft: "#ECFDF5",
        },
        warn: {
          DEFAULT: "#B45309",
          soft: "#FEF3C7",
        },
        bad: {
          DEFAULT: "#B91C1C",
          soft: "#FEE2E2",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "Hiragino Sans",
          "Meiryo",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Consolas",
          "monospace",
        ],
        display: [
          "Fraunces",
          "Noto Serif JP",
          "Georgia",
          "serif",
        ],
      },
      letterSpacing: {
        caps: "0.1em",
        tight2: "-0.025em",
        tight3: "-0.035em",
      },
      borderRadius: {
        DEFAULT: "4px",
        lg: "6px",
      },
    },
  },
  plugins: [],
} satisfies Config;
