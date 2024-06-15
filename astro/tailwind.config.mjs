/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            "code::before": {
              content: '""',
              "padding-left": "0.25rem",
            },
            "code::after": {
              content: '""',
              "padding-right": "0.25rem",
            },
            code: {
              "background-color": "#f7f8fb15",
              "border-radius": "0.25rem",
              "padding-top": "0.125rem",
              "padding-bottom": "0.25rem",
              color: "white",
              "font-weight": "600",
            },
          },
        },
      },
      fontFamily: {
        sans: ["brockmann-regular", "sans-serif"],
      },
      maxWidth: {
        152: "38rem",
        164: "41rem",
        208: "52rem",
      },
      animation: {
        "fade-in": "fadeIn 1s ease-in",
      },
      "fade-in": {
        "0%": {
          opacity: "0",
        },
        "100%": {
          opacity: "1",
        },
      },
      dropShadow: {
        glow: [
          "0 0px 20px rgba(255,255, 255, 0.35)",
          "0 0px 65px rgba(255, 255,255, 0.2)",
        ],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
