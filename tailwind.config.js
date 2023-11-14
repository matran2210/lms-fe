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
      'medium-sm': ['14px', { lineHeight: '16.9px' }],
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
          4: '#111424',
        },
        gray: {
          1: '#A1A1A1',
          2: '#DCDDDD',
          3: '#F1F1F1',
          4: '#F9F9F9',
          5: '#7E8299',
          6: '#D8D8E5',
          900: '#181C32',
        },
        overlay: {
          dark: 'rgba(0,0,0,0.5)',
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
        dark: '#1C2039',
      },
      borderWidth: {
        1.5: '1.5px',
      },
      boxShadow: {
        0: '0',
        sidebar:
          '0px 2px 4px 0px rgba(0, 0, 0, 0.08), 0px 0px 6px 0px rgba(0, 0, 0, 0.02)',
        'single-dialog': '0px 4px 62px 0px rgba(0, 0, 0, 0.07)',
      },
      height: {
        12.5: '50px',
      },
      minWidth: {
        4: '16px',
        6: '24px',
        8: '30px',
        small: '36px',
        default: '40px',
        medium: '48px',
        large: '56px',
      },
      minHeight: {
        4: '16px',
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
        16.75: '4.188rem',
        18: '72px',
      },
      padding: {
        1.8: '0.47rem', // 7.5px
        2.75: '0.688rem', // 11px
        3.25: '0.813rem', // 13px
        3.8: '0.89rem', // 14.3px
        3.8: '0.89rem', // 14.3px
        5.25: '1.313rem', // 21px
        17.5: '4.375rem', // 70px
        19: '4.75rem', // 76px
      },
      margin: {
        15: '3.75rem', // 60px
      },
      height: {
        12.5: '50px',
        16.75: '4.188rem',
        26: '6.5rem',
      },
      backgroundImage: {
        'radio-normal': `url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='%23A1A1A1' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='12'%3E%3C/circle%3E%3Ccircle cx='12' cy='12' r='11.25' fill='white'%3E%3C/circle%3E%3C/svg%3E")`,
        'radio-checked': `url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='%23008000' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='12'%3E%3C/circle%3E%3Ccircle cx='12' cy='12' r='11.25' fill='white'%3E%3C/circle%3E%3Ccircle cx='12' cy='12' r='6'%3E%3C/circle%3E%3C/svg%3E")`,
        'show-password': `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15.7656 7.36719C15.8203 7.47656 15.8477 7.61328 15.8477 7.77734C15.8477 7.91406 15.8203 8.05078 15.7656 8.16016C14.2891 11.0586 11.3359 13 8 13C4.63672 13 1.68359 11.0586 0.207031 8.16016C0.152344 8.05078 0.125 7.91406 0.125 7.75C0.125 7.61328 0.152344 7.47656 0.207031 7.36719C1.68359 4.46875 4.63672 2.5 8 2.5C11.3359 2.5 14.2891 4.46875 15.7656 7.36719ZM8 11.6875V11.7148C10.1602 11.7148 11.9375 9.9375 11.9375 7.77734V7.75C11.9375 5.58984 10.1602 3.8125 8 3.8125C5.8125 3.8125 4.0625 5.58984 4.0625 7.75C4.0625 9.9375 5.8125 11.6875 8 11.6875ZM8 5.125V5.15234C9.44922 5.15234 10.625 6.30078 10.625 7.75C10.625 9.19922 9.44922 10.375 8 10.375C6.55078 10.375 5.375 9.19922 5.375 7.75C5.375 7.53125 5.40234 7.28516 5.45703 7.06641C5.67578 7.23047 5.94922 7.3125 6.25 7.3125C6.96094 7.3125 7.53516 6.73828 7.53516 6.02734C7.53516 5.72656 7.45312 5.45312 7.28906 5.23438C7.50781 5.17969 7.75391 5.15234 8 5.125Z' fill='%23A1A1A1'/%3E%3C/svg%3E%0A")`,
        'hide-password': `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_5_9295)'%3E%3Cpath d='M7.87823 5.46598L10.1686 7.75637L10.1795 7.6364C10.1795 6.43303 9.20158 5.45508 7.99821 5.45508L7.87823 5.46598Z' fill='%23A1A1A1'/%3E%3Cpath d='M7.99819 4.00086C10.005 4.00086 11.6337 5.6296 11.6337 7.63641C11.6337 8.1054 11.5392 8.55257 11.3756 8.96337L13.5024 11.0902C14.6003 10.174 15.4656 8.98883 16 7.63641C14.7385 4.44442 11.6374 2.18311 7.99822 2.18311C6.98026 2.18311 6.00596 2.36487 5.10071 2.69207L6.67126 4.25897C7.08203 4.09902 7.5292 4.00086 7.99819 4.00086Z' fill='%23A1A1A1'/%3E%3Cpath d='M0.727096 2.01935L2.3849 3.67715L2.71575 4.008C1.51602 4.94597 0.567144 6.19297 0 7.63625C1.25791 10.8282 4.36265 13.0896 7.99819 13.0896C9.12522 13.0896 10.2013 12.8714 11.1866 12.4751L11.4956 12.7842L13.6151 14.9073L14.5422 13.9839L1.65416 1.09229L0.727096 2.01935ZM4.74802 6.03663L5.8714 7.16001C5.83868 7.31635 5.81687 7.47265 5.81687 7.63625C5.81687 8.83963 6.79482 9.81758 7.99819 9.81758C8.16179 9.81758 8.31813 9.79576 8.47083 9.76304L9.59421 10.8864C9.11067 11.1264 8.57263 11.2718 7.99819 11.2718C5.99138 11.2718 4.36265 9.64307 4.36265 7.63625C4.36265 7.06185 4.50808 6.52378 4.74802 6.03663Z' fill='%23A1A1A1'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_5_9295'%3E%3Crect width='16' height='16' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A")`,
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
  ],
}
