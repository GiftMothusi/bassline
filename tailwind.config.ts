import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bass: {
          bg: "#0c0e1a",
          bg2: "#111327",
          surface: "#1a1d35",
          surface2: "#1f2240",
          accent: "#9CFF00",
          accent2: "#7acc00",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
