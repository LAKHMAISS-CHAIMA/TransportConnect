import { defineConfig } from 'tailwindcss'

export default defineConfig({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        arabic: ['"Amiri"', 'serif'],
      },
      colors: {
        safran: "#C1272D",
        zellige: "#007A5E",
        majorelle: "#4C6EF5",
        sable: "#F4EBD0",
      },
    },
  },
  plugins: [],
});
