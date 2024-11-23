/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        clay: {
          50: '#f8f6f4',
          100: '#e8e6e4',
          200: '#d5cfc9',
          300: '#bbb1a7',
          400: '#a18f81',
          500: '#8b7565',
          600: '#745e4f',
          700: '#604c41',
          800: '#524139',
          900: '#483a33',
          950: '#2a211d',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
