import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nordic: {
          50: "#f4f7fb",
          100: "#e7eef6",
          200: "#cadbeb",
          300: "#9dbedb",
          400: "#699cc7",
          500: "#4581b2",
          600: "#346895",
          700: "#2b5479",
          800: "#274764",
          900: "#243d54",
          950: "#172638",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
