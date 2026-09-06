/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medical: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fc',
          400: '#36a9f7',
          500: '#0c8de4',
          600: '#026fc2',
          700: '#03589e',
          800: '#074b83',
          900: '#0c3f6e',
          950: '#082849',
        },
        risk: {
          high: '#dc2626',
          moderate: '#ea580c',
          review: '#d97706',
          safe: '#16a34a'
        }
      }
    },
  },
  plugins: [],
}
