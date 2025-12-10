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
        elegant: ['Playfair Display', 'serif'],
      },
      colors: {
        // Paleta elegante para moda
        primary: {
          50: '#faf8f6',
          100: '#f5f1ed',
          200: '#ede5dd',
          300: '#d4c5b9',
          400: '#b8a89a',
          500: '#9d8b7e',
          600: '#7a6b60',
          700: '#5a4d45',
          800: '#3d3530',
          900: '#2a2420',
        },
        accent: {
          50: '#fef9f3',
          100: '#fdf2e8',
          200: '#fce5d1',
          300: '#f9d1a8',
          400: '#f5b878',
          500: '#f09d4f',
          600: '#e67e22',
          700: '#d35400',
          800: '#a04000',
          900: '#6b2a00',
        },
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716b',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
      },
      brightness: {
        '55': 'brightness(0.55)',
      },
      boxShadow: {
        'elegant': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'elegant-lg': '0 10px 40px rgba(0, 0, 0, 0.12)',
        'elegant-hover': '0 20px 50px rgba(0, 0, 0, 0.15)',
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
}