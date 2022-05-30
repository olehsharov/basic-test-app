module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'saker': {
          900: '#003647',
          800: '#044351',
          700: '#08515B',
          600: '#0E6065',
          500: '#146F6E',
          400: '#1C7972',
          300: '#248376',
          200: '#2D8D7A',
          100: '#38977E'
        }
      },
    },
  },
  plugins: [],
}