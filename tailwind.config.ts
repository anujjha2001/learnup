import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        "on-background": "#A3A3A3",
        primary: "#8b5cf6",
        "primary-container": "#8b5cf6",
        "on-primary": "#ffffff",
        "on-primary-container": "#ffffff",
        secondary: "#f97316",
        "secondary-container": "#f97316",
        tertiary: "#7e3000",
        "tertiary-container": "#a44100",
        error: "#ba1a1a",
        "surface-container-low": "#0A0A0A",
        "surface-container-high": "#0A0A0A",
        "surface-variant": "#0A0A0A",
        "on-surface-variant": "#A3A3A3",
        outline: "#2A2A2A",
      },
      spacing: {
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "40px",
        gutter: "24px",
      },
      borderRadius: {
        lg: "0.5rem",
        xl: "0.75rem",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["48px", { lineHeight: "1.1", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "1.2", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "1.6" }],
        "body-md": ["16px", { lineHeight: "1.5" }],
        "label-md": ["14px", { lineHeight: "1.4", fontWeight: "500" }],
        "label-sm": ["12px", { lineHeight: "1.4", fontWeight: "600" }],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

export default config;