/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat_alternates: ['Montserrat Alternates', 'sans-serif'],
      }
      ,
      brightness: {
        '55': 'brightness(0.55)',
      },
    },
  },
  plugins: [],
}