import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        border: "border 4s linear infinite",
        "fade-in": "fade-in 0.2s ease-out",
        "zoom-in": "zoom-in 0.2s ease-out",
      },
      keyframes: {
        border: {
          to: { "--border-angle": "360deg" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "zoom-in": {
          "0%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" },
        },
      },
      colors: {
        whatsapp: {
          outgoing: "rgb(16 185 129)", // emerald-500
          incoming: "rgb(51 65 85)", // slate-700
        },
      },
    },
  },
  plugins: [daisyui],
};
