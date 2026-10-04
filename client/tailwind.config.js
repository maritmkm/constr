/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          sky: '#CBDDE9',
          blue: '#2872A1',
          bg: '#F7FAFC',
          text: '#172B3A',
          muted: '#64748B',
          border: '#E2E8F0',
        },
        primary: {
          DEFAULT: '#2872A1',
          light: '#CBDDE9',
          dark: '#1D557A',
          hover: '#205E85',
        },
      },
    },
  },
  plugins: [],
};
