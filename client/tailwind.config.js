/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EAF5FF',
          100: '#CDEAFF',
          200: '#A3D6FF',
          300: '#73BFFF',
          400: '#3AA1FF',
          500: '#0A84FF',
          600: '#085EC6',
          700: '#0643A0',
          800: '#052E73',
          900: '#041A3F',
          950: '#030A14',
        },
        gold: {
          400: '#d4af37',
          500: '#c9a227',
          600: '#b8941f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Sora', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #02050D 0%, #0A1628 38%, rgba(10,132,255,0.25) 68%, #0A84FF 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(10,132,255,0.12)',
        premium: '0 20px 60px -15px rgba(10,132,255,0.20)',
      },
    },
  },
  plugins: [],
};
