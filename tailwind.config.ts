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
        background: "#f8f9ff",
        "on-background": "#0b1c30",
        primary: "#3525cd",
        "primary-container": "#4f46e5",
        "on-primary": "#ffffff",
        "on-primary-container": "#dad7ff",
        secondary: "#712ae2",
        "secondary-container": "#8a4cfc",
        tertiary: "#7e3000",
        "tertiary-container": "#a44100",
        error: "#ba1a1a",
        "surface-container-low": "#eff4ff",
        "surface-container-high": "#dce9ff",
        "surface-variant": "#d3e4fe",
        "on-surface-variant": "#464555",
        outline: "#777587",
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