import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#00D395",
          dark: "#00B37E",
          light: "#33DFAB",
        },
        bg: {
          primary: "#09090B",
          secondary: "#111113",
          tertiary: "#18181B",
          elevated: "#1C1C1F",
        },
        border: {
          DEFAULT: "#27272A",
          hover: "#3F3F46",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;

