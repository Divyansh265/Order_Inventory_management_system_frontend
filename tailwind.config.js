/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        maroon: {
          50:  '#fdf2f4',
          100: '#fce7ea',
          200: '#f9d0d7',
          300: '#f4aab6',
          400: '#ec7589',
          500: '#e04d65',
          600: '#cc2d47',
          700: '#ac2039',
          800: '#800020',
          900: '#6b001a',
          950: '#3d000e',
        },
      },
    },
  },
  plugins: [],
};
