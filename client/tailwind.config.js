/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EEF1FF',
          100: '#E0E4FF',
          200: '#C5CBFF',
          400: '#6B7FF5',
          500: '#4661F2',
          600: '#3A52E0',
          700: '#2F44C4',
        },
        coral: {
          50: '#FFEDEE',
          100: '#FFD9DC',
          500: '#F0677A',
          600: '#E14B60',
        },
        ink: {
          900: '#1A1A1A',
          800: '#222222',
          700: '#3A3A3A',
          500: '#757575',
          400: '#9E9E9E',
          300: '#C4C4C4',
          200: '#E5E5E5',
          100: '#F0F0F0',
          50: '#FAFAFA',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 24px rgba(70, 97, 242, 0.18)',
        sheet: '0 20px 48px rgba(15, 23, 42, 0.18)',
        fab: '0 10px 26px rgba(70, 97, 242, 0.4)',
      },
      maxWidth: {
        phone: '390px',
      },
    },
  },
  plugins: [],
};
