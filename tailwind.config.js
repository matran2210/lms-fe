/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      xs: '376px',
      sm: '640px',
      md: '768px',
      'md-max': { max: '767px' },
      'md-checkout': { min: '1000px' },
      lg: '1024px',
      'lg-max': { max: '1023px' },
      xl: '1200px',
      'xl-max': { max: '1199px' },
      '2xl': '1440px',
      '3xl': '1536px',
    },
    extend: {},
  },
  plugins: [],
}
