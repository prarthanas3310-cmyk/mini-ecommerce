export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F2EFE3",
        "paper-dim": "#EAE5D3",
        ink: "#1E2B27",
        "ink-soft": "#5B6864",
        teal: {
          DEFAULT: "#24564C",
          dark: "#173B33",
          light: "#DCE8E1",
        },
        marigold: {
          DEFAULT: "#E2A73B",
          dark: "#C68A22",
          light: "#FBEBCB",
        },
        berry: {
          DEFAULT: "#A63A34",
          dark: "#832C27",
          light: "#F3DCDA",
        },
        sand: "#DAD3BE",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(30,43,39,0.06), 0 8px 20px -8px rgba(30,43,39,0.15)",
        "card-hover": "0 4px 8px rgba(30,43,39,0.08), 0 16px 32px -12px rgba(30,43,39,0.22)",
        lift: "0 12px 28px -10px rgba(30,43,39,0.35)",
      },
      keyframes: {
        "toast-in": {
          "0%": { transform: "translateY(-12px) scale(0.96)", opacity: 0 },
          "100%": { transform: "translateY(0) scale(1)", opacity: 1 },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        "toast-in": "toast-in 0.25s cubic-bezier(0.16,1,0.3,1)",
        shimmer: "shimmer 1.6s infinite linear",
        "fade-up": "fade-up 0.4s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};
