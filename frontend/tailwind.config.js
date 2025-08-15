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
          DEFAULT: '#1A56DB',
          light: '#3B82F6',
          dark: '#1E3A8A',
          secondary: '#7E3AF2',
          accent: '#16BDCA',
          background: '#F5F7FA',
          foreground: '#1F2937'
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
