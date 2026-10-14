/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forme: {
          ivory: '#F7F5F0',
          cream: '#EDE8DF',
          charcoal: '#242522',
          olive: '#45483B',
          taupe: '#B6AA9A',
          terracotta: '#B66E4B',
          white: '#FFFFFF',
          // Shaded variants for subtle states
          stone: '#E3DDD3',
          dark: '#1A1A18',
          sand: '#FAF8F5',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        editorial: '0.05em',
        relaxed: '0.025em',
      },
      transitionTimingFunction: {
        'forme-smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      boxShadow: {
        'forme-subtle': '0 4px 20px -2px rgba(36, 37, 34, 0.05)',
        'forme-elevated': '0 12px 32px -4px rgba(36, 37, 34, 0.08)',
        'forme-modal': '0 24px 48px -8px rgba(36, 37, 34, 0.12)',
      },
    },
  },
  plugins: [],
};
