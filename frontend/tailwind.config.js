/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        traffic: {
          blue: {
            light: '#38bdf8',
            DEFAULT: '#0ea5e9',
            dark: '#0284c7',
            deep: '#0369a1',
          },
          green: {
            light: '#4ade80',
            DEFAULT: '#22c55e',
            dark: '#16a34a',
            deep: '#15803d',
          },
          dark: {
            bg: '#0f172a',
            card: '#1e293b',
            border: '#334155',
          }
        }
      },
      animation: {
        'shimmer': 'shimmer 2s infinite linear',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      }
    },
  },
  plugins: [],
}
