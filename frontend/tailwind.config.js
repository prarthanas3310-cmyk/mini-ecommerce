/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F6F4EF",
        ink: "#1F2420",
        teal: {
          50: "#EAF3F0",
          100: "#CFE3DC",
          400: "#1E8A72",
          500: "#0F6B5C",
          600: "#0B5347",
          700: "#083D34",
        },
        marigold: {
          100: "#FBE7C2",
          400: "#EFA93B",
          500: "#E8A33D",
          600: "#C9821F",
        },
        clay: "#C4573B",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      boxShadow: {
        tag: "0 1px 0 rgba(31,36,32,0.06), 0 8px 24px -12px rgba(31,36,32,0.18)",
      },
    },
  },
  plugins: [],
};
