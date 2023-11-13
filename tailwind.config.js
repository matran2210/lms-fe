/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    screens: {
      xs: '376px',
      sm: '640px',
      md: '768px',
      'md-max': { max: '767px' },
      'md-checkout': { min: '1000px' },
      '2md': '992px',
      lg: '1024px',
      'lg-max': { max: '1023px' },
      xl: '1280px',
      'xl-max': { max: '1199px' },
      '2xl': '1440px',
      '2xl-min': { min: '1441px' },
      '3xl': '1536px',
      '4xl': '1920px',
    },
    fontSize: {
      '5xl': ['40px', { lineHeight: '50px' }],
      '4xl': ['36px', { lineHeight: '45px' }],
      '3xl': ['32px', { lineHeight: '40px' }],
      '2xl': ['24px', { lineHeight: '30px' }],
      xl: ['20px', { lineHeight: '25px' }],
      lg: ['18px', { lineHeight: '24px' }],
      base: ['16px', { lineHeight: '24px' }],
      sm: ['14px', { lineHeight: '24px' }],
      xsm: ['13px', { lineHeight: '19.5px' }],
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '16px',
        md: '24px',
        xl: '32px',
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFB800',
        },
        secondary: {
          DEFAULT: '#FFFAF0',
        },
        state: {
          info: '#3964EA',
          success: '#008000',
          error: '#D35563',
        },
        bw: {
          1: '#141414',
          2: '#404041',
          3: '#FFFFFF',
        },
        gray: {
          1: '#A1A1A1',
          2: '#DCDDDD',
          3: '#F1F1F1',
          4: '#F9F9F9',
          5: '#7E8299',
          6: '#D8D8E5',
        },
      },
      borderColor: {
        DEFAULT: '#DCDDDD',
        default: '#DCDDDD',
        focus: '#141414',
        error: '#D35563',
        'gray-1': '#A1A1A1',
        'gray-2': '#F1F1F1',
        active: '#FFB800',
      },
      borderWidth: {
        1.5: '1.5px',
      },
      boxShadow: {
        0: '0',
        sidebar:
          '0px 2px 4px 0px rgba(0, 0, 0, 0.08), 0px 0px 6px 0px rgba(0, 0, 0, 0.02)',
      },
      height: {
        12.5: '50px',
      },
      minWidth: {
        6: '24px',
        8: '30px',
        small: '36px',
        default: '40px',
        medium: '48px',
        large: '56px',
      },
      minHeight: {
        6: '24px',
        8: '30px',
        small: '36px',
        default: '40px',
        medium: '48px',
        large: '56px',
      },
      maxWidth: {
        md: '448px',
        lg: '512px',
        xl: '576px',
        '8xl': '1920px',
      },
      lineHeight: {
        0: '0',
        4.5: '17px',
        4.8: '18px',
        5.2: '20.962px',
        6.2: '25px',
        6.5: '27px',
        7.5: '30px',
        8.5: '33px',
        11: '45px',
      },
      borderRadius: {
        none: '0px',
        full: '9999px',
      },
      content: {
        empty: '""',
      },
      width: {
        12.5: '50px',
        18: '72px',
      },
      padding: {
        1.8: '0.47rem', // 7.5px
        2.8: '0.72rem', // 11.5px
        3.8: '0.89rem', // 14.3px
      },
      height: {
        12.5: '50px',
        26: '6.5rem',
      },
      backgroundImage: {
        'radio-normal': `url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='%23A1A1A1' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='12'%3E%3C/circle%3E%3Ccircle cx='12' cy='12' r='11.25' fill='white'%3E%3C/circle%3E%3C/svg%3E")`,
        'radio-checked': `url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='%23008000' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='12'%3E%3C/circle%3E%3Ccircle cx='12' cy='12' r='11.25' fill='white'%3E%3C/circle%3E%3Ccircle cx='12' cy='12' r='6'%3E%3C/circle%3E%3C/svg%3E")`,
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
  ],
}
