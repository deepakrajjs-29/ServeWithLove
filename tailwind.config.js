/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#e53935',
          light: '#ff6f60',
          dark: '#ab000d',
        }
      }
    },
  },
  plugins: [],
}
