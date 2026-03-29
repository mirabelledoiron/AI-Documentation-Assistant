// frontend/tailwind.config.js (AT ROOT OF FRONTEND)
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        atelier: {
          bg: 'hsl(var(--atelier-bg) / <alpha-value>)',
          fg: 'hsl(var(--atelier-fg) / <alpha-value>)',
          muted: 'hsl(var(--atelier-muted) / <alpha-value>)',
          mutedBg: 'hsl(var(--atelier-muted-bg) / <alpha-value>)',
          border: 'hsl(var(--atelier-border) / <alpha-value>)',
          primary: 'hsl(var(--atelier-primary) / <alpha-value>)',
          accent: 'hsl(var(--atelier-accent) / <alpha-value>)',
        },
      },
      borderRadius: {
        atelier: 'var(--atelier-radius)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
