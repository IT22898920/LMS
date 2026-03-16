/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':      'fadeIn 0.4s ease-out',
        'slide-up':     'slideUp 0.4s ease-out',
        'slide-in-left':'slideInLeft 0.5s ease-out',
        'float':        'float 6s ease-in-out infinite',
        'float-delay':  'float 6s ease-in-out 2s infinite',
        'float-slow':   'float 8s ease-in-out 1s infinite',
        'gradient':     'gradient 8s ease infinite',
        'pulse-slow':   'pulse 3s ease-in-out infinite',
        'bounce-slow':  'bounce 3s ease-in-out infinite',
        'spin-slow':    'spin 12s linear infinite',
        'shimmer':      'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn:       { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:      { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideInLeft:  { from: { opacity: '0', transform: 'translateX(-24px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        float:        { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-16px)' } },
        gradient:     { '0%,100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
        shimmer:      { from: { backgroundPosition: '-200% 0' }, to: { backgroundPosition: '200% 0' } },
      },
      backgroundSize: { '300%': '300%' },
      boxShadow: {
        'glow':    '0 0 40px rgba(99,102,241,0.3)',
        'glow-lg': '0 0 80px rgba(99,102,241,0.2)',
        'card':    '0 4px 24px rgba(0,0,0,0.06)',
        'card-hover': '0 12px 40px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
};
