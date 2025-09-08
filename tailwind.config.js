/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        dark: "var(--dark)",
        darker: "var(--darker)",
        "text-light": "var(--text-light)",
        "text-muted": "var(--text-muted)",
      },
    },
  },
  plugins: [],
}

