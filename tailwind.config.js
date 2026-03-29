export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8f9fa',
          100: '#f1f3f4',
          200: '#e8eaed',
          300: '#dadce0',
          400: '#bdc1c6',
          500: '#9aa0a6',
          600: '#80868b',
          700: '#5f6368',
          800: '#3c4043',
          900: '#202124',
          950: '#1a1d20',
        },
        brand: {
          50: '#f0f2f5',
          100: '#e1e5ea',
          200: '#c3cbd5',
          300: '#a5b1c0',
          400: '#8797ab',
          500: '#29405A',
          600: '#395A7E',
          700: '#4974A2',
          800: '#658EB9',
          900: '#395775',
          950: '#1a2a3a',
        },
        accent: {
          50: '#f0f4f8',
          100: '#dde7f0',
          200: '#bbd0e1',
          300: '#99b9d2',
          400: '#77a2c3',
          500: '#658EB9',
          600: '#4974A2',
          700: '#395A7E',
          800: '#29405A',
          900: '#395775',
          950: '#1a2a3a',
        }
      },
      fontFamily: {
        sans: ['Helvetica Neue'],
        mono: ['Monaco', 'Consolas', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
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
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}


