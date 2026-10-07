/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        arch: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          dark: '#0F172A',
          darkCard: '#1E293B',
          slate: '#334155',
          muted: '#475569',
          sand: '#CBDDE9',
          terracotta: '#2872A1',
          bronze: '#38BDF8',
          accent: '#2872A1',
        },
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
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        widest: '0.25em',
      },
    },
  },
  plugins: [],
};
