import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0B",
        surface: {
          DEFAULT: "#111114",
          elevated: "#17171C",
          hover: "#1C1C22",
        },
        line: {
          DEFAULT: "#242429",
          strong: "#33333B",
        },
        ink: {
          DEFAULT: "#FAFAFA",
          secondary: "#A1A1AA",
          tertiary: "#71717A",
          muted: "#52525B",
        },
        accent: {
          DEFAULT: "#F5A524",
          dim: "#B45309",
        },
        ok: {
          DEFAULT: "#10B981",
          dim: "#047857",
        },
        warn: {
          DEFAULT: "#F59E0B",
          dim: "#B45309",
        },
        bad: {
          DEFAULT: "#EF4444",
          dim: "#B91C1C",
        },
        info: "#0EA5E9",
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
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      letterSpacing: {
        caps: "0.08em",
        tight2: "-0.025em",
        tight3: "-0.03em",
      },
      borderRadius: {
        DEFAULT: "6px",
        lg: "10px",
        xl: "14px",
      },
    },
  },
  plugins: [],
} satisfies Config;
