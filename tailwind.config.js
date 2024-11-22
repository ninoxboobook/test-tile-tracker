/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/views/**/*.ejs",
  ],
  theme: {
    extend: {
      colors: {
        'clay': {
          50: '#faf6f3',
          100: '#f2e8e1',
          200: '#e5d1c4',
          300: '#d7b4a3',
          400: '#c79882',
          500: '#b87c61',
          600: '#a86547',
          700: '#8c523b',
          800: '#714335',
          900: '#5c382e'
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
}
