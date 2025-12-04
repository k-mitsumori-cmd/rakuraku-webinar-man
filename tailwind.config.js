/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'prtimes-red': '#E60012',
        'prtimes-dark': '#1a1a1a',
        'prtimes-gray': '#f5f5f5',
      },
    },
  },
  plugins: [],
}

