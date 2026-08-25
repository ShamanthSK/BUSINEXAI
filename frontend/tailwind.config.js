/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        palette: {
          crimson: '#890304',
          darkNavy: '#00113a',
          royalNavy: '#002263',
          sand: '#e8e5c3',
          cream: '#f8f2bf'
        },
        stratos: {
          bg: '#00113a',
          card: 'rgba(0, 34, 99, 0.8)',
          cardBorder: 'rgba(232, 229, 195, 0.2)',
          accent: '#890304',
          accentGlow: 'rgba(137, 3, 4, 0.4)',
          emerald: '#e8e5c3',
          amber: '#f8f2bf',
          rose: '#890304',
          cyan: '#e8e5c3',
          purple: '#002263',
          muted: '#e8e5c3'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'glow-grid': 'radial-gradient(circle at 50% 50%, rgba(137, 3, 4, 0.18) 0%, transparent 60%), linear-gradient(to right, rgba(232, 229, 195, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(232, 229, 195, 0.04) 1px, transparent 1px)',
        'glass-gradient': 'linear-gradient(135deg, rgba(0, 34, 99, 0.85) 0%, rgba(0, 17, 58, 0.95) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-spin': 'spin 12s linear infinite',
      }
    },
  },
  plugins: [],
}
