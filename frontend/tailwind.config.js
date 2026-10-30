/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#faf8f4', // page background
        cream: '#f1ece1', // soft surfaces
        ink: '#1f2a2e', // text
        sand: '#e2dacb', // lines and hovers
        leaf: '#3f6b57', // secondary green
        accent: '#c2410c', // warm terracotta
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
