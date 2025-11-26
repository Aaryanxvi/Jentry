/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#000000',
        },
      },
      borderRadius: {
        xl: '0.75rem',
      },
    },
  },
  plugins: [],
};


