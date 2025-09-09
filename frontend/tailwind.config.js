/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#6366F1',
          light: '#818CF8',
          dark: '#4F46E5',
          accent: '#F59E0B',
          background: '#111827',
          foreground: '#F3F4F6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
        heading: ['Roboto', 'Inter', 'sans-serif']
      },
      spacing: {
        '128': '32rem',
        '144': '36rem'
      }
    },
  },
  plugins: [],
}
