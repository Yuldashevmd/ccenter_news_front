/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        primary: ["Manrope", "sans-serif"],
        secondary: ["Lobster", "cursive"],
      },
      borderRadius: {
        6: "6px",
        12: "12px",
        24: "24px",
        100: "100%",
      },
    },
  },
  plugins: [],
};
