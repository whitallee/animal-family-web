/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
      './app/**/*.{ts,tsx}',
      './components/**/*.{ts,tsx}',
      './src/**/*.{ts,tsx}', // If you have a `src` directory
      './node_modules/@shadcn/ui/**/*.{js,ts,jsx,tsx}', // optional, for shadcn components
    ],
    theme: {
      extend: {},
    },
    plugins: [require('tailwindcss-animate')],
  }
  