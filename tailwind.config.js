/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['degular-display', 'sans-serif'],
        sans: ['degular', 'sans-serif'],
      },
      colors: {
        clay: {
          50: '#FAF8F6',
          100: '#F4EFEB',
          200: '#EDE4DE',
          300: '#DFCFC4',
          400: '#D0B8A8',
          500: '#B09C8E',
          600: '#918075',
          700: '#72655C',
          800: '#534943',
          900: '#342D2A',
          950: '#151211',
        },
        sand: {
          DEFAULT: '#FBF4EF',
          light: '#FDFAF7',
        },
        brand: {
          DEFAULT: '#C5705D',
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
