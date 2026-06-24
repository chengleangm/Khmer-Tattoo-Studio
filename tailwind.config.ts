import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#050706",
        charcoal: "#111312",
        ash: "#ededeb",
        bone: "#f7f7f3",
        teal: "#c8a24a",
      },
      fontFamily: {
        display: ["var(--font-bebas)", "Impact", "sans-serif"],
        condensed: ["var(--font-oswald)", "Arial Narrow", "sans-serif"],
        sans: ["var(--font-inter)", "Arial", "sans-serif"],
      },
      letterSpacing: {
        editorial: "0.08em",
      },
      animation: {
        "fade-up": "fadeUp 700ms ease both",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
