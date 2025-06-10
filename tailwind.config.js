import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/components/(badge|button|card|chip|code|drawer|dropdown|image|input|kbd|link|listbox|navbar|radio|scroll-shadow|select|skeleton|slider|snippet|toggle|tabs|toast|popover|user|ripple|spinner|modal|menu|divider|form|avatar).js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        border: "hsl(var(--border))",
        // Magic UI - Rainbow Button:
        "color-1": "hsl(var(--color-1))",
        "color-2": "hsl(var(--color-2))",
        "color-3": "hsl(var(--color-3))",
        "color-4": "hsl(var(--color-4))",
        "color-5": "hsl(var(--color-5))",
      },
      boxShadow: {
        // Well shadows
        "well-sm":
          "inset 0 3px 10px 0 rgba(0, 0, 0, 0.08), inset -1px 0 4px 0 rgba(0, 0, 0, 0.03), inset 1px 0 4px 0 rgba(0, 0, 0, 0.03)",
        "well-md":
          "inset 0 4px 12px 0 rgba(0, 0, 0, 0.10), inset -1.5px 0 5px 0 rgba(0, 0, 0, 0.04), inset 1.5px 0 5px 0 rgba(0, 0, 0, 0.04)",
        "well-lg":
          "inset 0 5px 15px 0 rgba(0, 0, 0, 0.12), inset -2px 0 6px 0 rgba(0, 0, 0, 0.05), inset 2px 0 6px 0 rgba(0, 0, 0, 0.05)",

        // Dark mode well shadows
        "well-dark-sm":
          "inset 0 5px 15px 0 rgba(0, 0, 0, 0.35), inset -2px 0 5px 0 rgba(0, 0, 0, 0.12), inset 2px 0 5px 0 rgba(0, 0, 0, 0.12)",
        "well-dark-md":
          "inset 0 6px 18px 0 rgba(0, 0, 0, 0.40), inset -2.5px 0 6px 0 rgba(0, 0, 0, 0.15), inset 2.5px 0 6px 0 rgba(0, 0, 0, 0.15)",
        "well-dark-lg":
          "inset 0 8px 20px 0 rgba(0, 0, 0, 0.45), inset -3px 0 8px 0 rgba(0, 0, 0, 0.18), inset 3px 0 8px 0 rgba(0, 0, 0, 0.18)",

        // New directional well shadows
        "well-left-lg":
          "inset 2px 0 6px 0 rgba(0, 0, 0, 0.05), inset 0 5px 15px 0 rgba(0, 0, 0, 0.12)",
        "well-right-lg":
          "inset -2px 0 6px 0 rgba(0, 0, 0, 0.05), inset 0 5px 15px 0 rgba(0, 0, 0, 0.12)",
        "well-top-lg":
          "inset 0 2px 6px 0 rgba(0, 0, 0, 0.05), inset 0 5px 15px 0 rgba(0, 0, 0, 0.12)",
        "well-bottom-lg":
          "inset 0 -2px 6px 0 rgba(0, 0, 0, 0.05), inset 0 -5px 15px 0 rgba(0, 0, 0, 0.12)",

        // Dark mode directional well shadows
        "well-dark-left-lg":
          "inset 3px 0 8px 0 rgba(0, 0, 0, 0.18), inset 0 8px 20px 0 rgba(0, 0, 0, 0.45)",
        "well-dark-right-lg":
          "inset -3px 0 8px 0 rgba(0, 0, 0, 0.18), inset 0 8px 20px 0 rgba(0, 0, 0, 0.45)",
        "well-dark-top-lg":
          "inset 0 3px 8px 0 rgba(0, 0, 0, 0.18), inset 0 8px 20px 0 rgba(0, 0, 0, 0.45)",
        "well-dark-bottom-lg":
          "inset 0 -3px 8px 0 rgba(0, 0, 0, 0.18), inset 0 -8px 20px 0 rgba(0, 0, 0, 0.45)",
      },
      keyframes: {
        // Magic UI - Rainbow Button:
        rainbow: {
          "0%": { "background-position": "0%" },
          "100%": { "background-position": "200%" },
        },
      },
      animation: {
        // Magic UI - Rainbow Button:
        rainbow: "rainbow var(--speed, 10s) infinite linear",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};

module.exports = config;
