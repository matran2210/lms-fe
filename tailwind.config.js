/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    screens: {
      mxl: '992px',
      xs: '23.5rem',
      sm: '40rem',
      mxl: '992px',
      md: '48rem',
      mxl: '992px',
      lg: '64rem',
      xl: '80rem',
      'xl-max': { max: '74.9375rem' },
      '2xl': '90rem',
      '2xl-min': { min: '90.0625rem' },
      '2xl-max': { max: '79.9375rem' },
      '3xl': '96rem',
      '3.5xl': '1030.75rem',
      '4xl': '120rem',
      mxl: '992px',
    },
    fontSize: {
      '6xl': ['4rem', { lineHeight: '4.8125rem ' }],
      '5xl': ['2.5rem', { lineHeight: '3.125rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.8125rem' }],
      '3xl': ['2rem', { lineHeight: '2.5rem' }],
      '2xl': ['1.5rem', { lineHeight: '1.875rem' }],
      xl: ['1.25rem', { lineHeight: '1.5625rem' }],
      'lg-xl': ['1.125rem', { lineHeight: '16875rem' }],
      lg: ['1.125rem', { lineHeight: '1.5rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      sm: ['0.875rem', { lineHeight: '1.5rem' }],
      'medium-sm': ['0.875rem', { lineHeight: '1.05625rem' }],
      xsm: ['0.8125rem', { lineHeight: '1.21875rem' }],
      ssm: ['0.75rem', { lineHeight: '1.25rem' }],
    },
    fontFamily: {
      sans: ['Roboto', 'sans-serif'],
      // sans: ['Inter', 'sans-serif'],
      tech: 'techNology',
      inter: ['Inter', 'sans-serif'],
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        md: '1.5rem',
        xl: '2rem',
        '4xl': '10.9375rem',
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFB800',
          2: '#FFC83A',
          3: '#E5A600',
        },
        secondary: {
          DEFAULT: '#FFFAF0',
        },
        danger: {
          DEFAULT: '#D35563',
          2: '#dd4339',
        },
        state: {
          info: '#3964EA',
          success: '#397839',
          error: '#B90E0A',
        },
        bw: {
          1: '#050505',
          2: '#141414',
          3: '#FFFFFF',
          4: '#111424',
          5: '#000000CC',
          6: '#F9FAFC',
          7: '#EDEFF5',
          9: '#C3C3C3',
          10: 'rgba(0, 0, 0, 0.80)',
        },
        gray: {
          1: '#A1A1A1',
          2: '#DCDDDD',
          3: '#F1F1F1',
          4: '#F9F9F9',
          5: '#7E8299',
          6: '#D8D8E5',
          7: '#E3E3E3',
          8: '#F3F3F3',
          900: '#181C32',
        },
        overlay: {
          dark: 'rgba(0,0,0,0.5)',
          'dark-sidebar': 'rgba(0, 0, 0, 0.8)',
          play: 'rgba(189, 189, 189, 0.7)',
          control: 'rgba(0, 0, 0, 0.6)',
          white: 'rgba(255, 255, 255, 0.4)',
          loading: 'rgba(0, 0, 0, 0.3)',
        },
        blue: {
          1: '#0000EE',
        },
        pinned: {
          1: '#18355D',
        },
        support: {
          1: '#33475B',
        },
        blur: {
          yellow: '#FFB8001A',
          green: '#3978391A',
        },
        graded: {
          finish: '#4077E0',
        },
      },
      borderColor: {
        DEFAULT: '#DCDDDD',
        default: '#DCDDDD',
        focus: '#141414',
        success: '#397839',
        error: '#B90E0A',
        'gray-1': '#A1A1A1',
        'gray-2': '#F1F1F1',
        'gray-3': '#F8F8F8',
        'gray-4': '#F3F3F3',
        'pinned-1': '#18355D',
        active: '#FFB800',
        'graded-finish': '#4077E0',
        dark: '#1C2039',
      },
      borderWidth: {
        1.5: '0.09375rem',
      },
      boxShadow: {
        0: '0',
        activity: '0 0.125rem 0.25rem 0 #00000014, 0 0 0.375rem 0 #00000005',
        sidebar:
          '0 0.125rem 0.25rem 0 rgba(0, 0, 0, 0.08), 0 0 0.375rem 0 rgba(0, 0, 0, 0.02)',
        'single-dialog': '0 0.25rem 3.875rem 0 rgba(0, 0, 0, 0.07)',
        box: '0 0.125rem 0.25rem 0 #00000014, 0 0 0.375rem 0 #00000005',
        notify: '0 0 3.125rem 0 rgba(152, 151, 147, 0.15)',
        solution: '0 0.125rem 0.4375rem 0 rgba(0, 0, 0, 0.13)',
        'questions-exhibits':
          '0.3125rem -0.375rem 0.625rem -0.25rem rgba(0, 0, 0, 0.15)',
        'question-footer': '0 -0.125rem 0.4375rem 0 rgba(0, 0, 0, 0.13)',
        preview: '0 0.25rem 0.75rem 0 rgba(0, 0, 0, 0.10)',
        select:
          '0 0.25rem 0.5rem 0 rgba(0, 0, 0, 0.06), 0 0 0.25rem 0 rgba(0, 0, 0, 0.04)',
        'sidebar-tablet': '0 -0.125rem 0.4375rem 0 #0000001A',
        pagination: '0 0.125rem 0.4375rem 0 #00000021',
        pinned: '0 0.0625rem 0.1875rem 0.1875rem rgba(0, 0, 0, .1)',
        livechat:
          'rgba(0, 0, 0, 0.1) 0 0.0625rem 0.25rem, rgba(0, 0, 0, 0.2) 0 0.125rem 0.75rem',
      },
      minWidth: {
        4: '1rem',
        6: '1.5rem',
        8: '1.875rem',
        small: '2.25rem',
        default: '2.5rem',
        medium: '3rem',
        large: '3.5rem',
        '62px': '3.875rem',
        '78px': '4.875rem',
        '132px': '8.25rem',
        '165px': '10.3125rem',
        '190px': '11.875rem',
        '400px': '25rem',
      },
      minHeight: {
        4: '1rem',
        5.5: '1.375rem',
        6: '1.5rem',
        8: '1.875rem',
        small: '2.25rem',
        default: '2.5rem',
        medium: '0.0625rem',
        large: '3.5rem',
        352: '22rem',
      },
      maxHeight: {
        0: 0,
        5.5: '1.375rem',
      },
      maxWidth: {
        27: '6.875rem',
        78: '19rem',
        '365px': '22.8125rem',
        smd: '25.125rem',
        md: '28rem',
        lg: '32rem',
        xl: '36rem',
        dl: '40.375rem',
        '2dl': '59.375rem',
        xxl: '71.5rem',
        '8xl': '120rem',
      },
      lineHeight: {
        0: '0',
        4.5: '1.0625rem',
        4.8: '1.125rem',
        4.9: '1.2rem',
        5.2: '1.310125rem',
        6.2: '1.5625rem',
        6.5: '1.6875rem',
        7.5: '1.875rem',
        8.5: '2.0625rem',
        11: '2.8125rem',
      },
      borderRadius: {
        none: '0',
        full: '62.4375rem',
      },
      content: {
        empty: '""',
      },
      width: {
        5.5: '1.375rem',
        12.5: '3.125rem',
        16.75: '4.188rem',
        18: '4.5rem',
        30: '7.5rem',
        4.5: '1.125rem',
        '6-percent': '6%',
        '7-percent': '7%',
        18: '18%',
        3.6: '36%',
        17: '17%',
        '624px': '39rem',
      },
      padding: {
        1.8: '0.47rem', // 7.5px
        2.75: '0.688rem', // 11px
        2.8: '0.71875rem', // 11.5px
        3.25: '0.813rem', // 13px
        3.8: '0.89rem', // 14.3px
        4.5: '1.125rem', // 18px
        5.25: '1.313rem', // 21px
        5.75: '1.4375rem', // 23px
        6.5: '1.65625rem',
        7.5: '1.875rem', // 30px
        8.25: '2.0625rem', // 33px
        17.5: '4.375rem', // 70px
        19: '4.75rem', // 76px
        22: '5.375rem', //86px
        29.2: '7.3rem',
      },
      margin: {
        4.5: '1.125rem', // 18px
        8.25: '2.0625rem', // 33px
        13: '3.25rem', // 52px
        15: '3.75rem', // 60px
      },
      inset: {
        27: '6.75rem',
      },
      height: {
        4.5: '1.125rem', // 18px
        5.5: '1.375rem',
        8.5: '2.125rem',
        12.5: '3.125rem',
        16.75: '4.188rem',
        26: '6.5rem',
        30: '7.5rem', // 120px
      },
      opacity: {
        55: '0.55',
      },
      backgroundImage: {
        'radio-normal': `url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='%23A1A1A1' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='12'%3E%3C/circle%3E%3Ccircle cx='12' cy='12' r='11.25' fill='white'%3E%3C/circle%3E%3C/svg%3E")`,
        'radio-default-checked': `url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='%23141414' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='12'%3E%3C/circle%3E%3Ccircle cx='12' cy='12' r='11.25' fill='white'%3E%3C/circle%3E%3Ccircle cx='12' cy='12' r='6'%3E%3C/circle%3E%3C/svg%3E")`,
        'radio-success-checked': `url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='%23008000' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='12'%3E%3C/circle%3E%3Ccircle cx='12' cy='12' r='11.25' fill='white'%3E%3C/circle%3E%3Ccircle cx='12' cy='12' r='6'%3E%3C/circle%3E%3C/svg%3E")`,
        'radio-error-checked': `url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='%23D35563' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='12'%3E%3C/circle%3E%3Ccircle cx='12' cy='12' r='11.25' fill='white'%3E%3C/circle%3E%3Ccircle cx='12' cy='12' r='6'%3E%3C/circle%3E%3C/svg%3E")`,
        'show-password': `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15.7656 7.36719C15.8203 7.47656 15.8477 7.61328 15.8477 7.77734C15.8477 7.91406 15.8203 8.05078 15.7656 8.16016C14.2891 11.0586 11.3359 13 8 13C4.63672 13 1.68359 11.0586 0.207031 8.16016C0.152344 8.05078 0.125 7.91406 0.125 7.75C0.125 7.61328 0.152344 7.47656 0.207031 7.36719C1.68359 4.46875 4.63672 2.5 8 2.5C11.3359 2.5 14.2891 4.46875 15.7656 7.36719ZM8 11.6875V11.7148C10.1602 11.7148 11.9375 9.9375 11.9375 7.77734V7.75C11.9375 5.58984 10.1602 3.8125 8 3.8125C5.8125 3.8125 4.0625 5.58984 4.0625 7.75C4.0625 9.9375 5.8125 11.6875 8 11.6875ZM8 5.125V5.15234C9.44922 5.15234 10.625 6.30078 10.625 7.75C10.625 9.19922 9.44922 10.375 8 10.375C6.55078 10.375 5.375 9.19922 5.375 7.75C5.375 7.53125 5.40234 7.28516 5.45703 7.06641C5.67578 7.23047 5.94922 7.3125 6.25 7.3125C6.96094 7.3125 7.53516 6.73828 7.53516 6.02734C7.53516 5.72656 7.45312 5.45312 7.28906 5.23438C7.50781 5.17969 7.75391 5.15234 8 5.125Z' fill='%23A1A1A1'/%3E%3C/svg%3E%0A")`,
        'hide-password': `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clipPath='url(%23clip0_5_9295)'%3E%3Cpath d='M7.87823 5.46598L10.1686 7.75637L10.1795 7.6364C10.1795 6.43303 9.20158 5.45508 7.99821 5.45508L7.87823 5.46598Z' fill='%23A1A1A1'/%3E%3Cpath d='M7.99819 4.00086C10.005 4.00086 11.6337 5.6296 11.6337 7.63641C11.6337 8.1054 11.5392 8.55257 11.3756 8.96337L13.5024 11.0902C14.6003 10.174 15.4656 8.98883 16 7.63641C14.7385 4.44442 11.6374 2.18311 7.99822 2.18311C6.98026 2.18311 6.00596 2.36487 5.10071 2.69207L6.67126 4.25897C7.08203 4.09902 7.5292 4.00086 7.99819 4.00086Z' fill='%23A1A1A1'/%3E%3Cpath d='M0.727096 2.01935L2.3849 3.67715L2.71575 4.008C1.51602 4.94597 0.567144 6.19297 0 7.63625C1.25791 10.8282 4.36265 13.0896 7.99819 13.0896C9.12522 13.0896 10.2013 12.8714 11.1866 12.4751L11.4956 12.7842L13.6151 14.9073L14.5422 13.9839L1.65416 1.09229L0.727096 2.01935ZM4.74802 6.03663L5.8714 7.16001C5.83868 7.31635 5.81687 7.47265 5.81687 7.63625C5.81687 8.83963 6.79482 9.81758 7.99819 9.81758C8.16179 9.81758 8.31813 9.79576 8.47083 9.76304L9.59421 10.8864C9.11067 11.1264 8.57263 11.2718 7.99819 11.2718C5.99138 11.2718 4.36265 9.64307 4.36265 7.63625C4.36265 7.06185 4.50808 6.52378 4.74802 6.03663Z' fill='%23A1A1A1'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_5_9295'%3E%3Crect width='16' height='16' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A")`,
      },
      gap: {
        7.5: '1.875rem', // 30px
      },
      keyframes: {
        'jump-in': {
          '0%': { transform: 'scale(0.5)' },
          '100%': { transform: 'scale(1)' },
        },
        'jump-out': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0.5)' },
        },
        'fade-in-overlay': {
          '0%': { opacity: '0' },
          '100%': { opacity: '0.' },
        },
        'fade-out-overlay': {
          '0%': { opacity: '0.8' },
          '100%': { opacity: '0' },
        },
        'fade-in-sidebar': {
          '0%': { right: '-100%' },
          '100%': { right: '0' },
        },
        'fade-out-sidebar': {
          '0%': { right: '0' },
          '100%': { right: '-100%' },
        },
      },
      animation: {
        'jump-in': 'jump-in 0.1s ease-in-out',
        'jump-out': 'jump-out 0.1s ease-in-out',
        'fade-in-overlay': 'fade-in-overlay 0.1s ease-in-out',
        'fade-out-overlay': 'fade-out-overlay 0.1s ease-out',
        'fade-in-sidebar': 'fade-in-sidebar 0.4s ease-in-out',
        'fade-out-sidebar': 'fade-out-sidebar 0.3s ease-in-out',
        'fade-in-overlay-sidebar': 'fade-in-overlay 0.3s ease-in-out',
        'fade-out-overlay-sidebar': 'fade-out-overlay 0.3s ease-out',
      },
      gridTemplateColumns: {
        'test-result': 'minmax(0, 3fr) minmax(0, 1fr)',
        15: 'repeat(15, minmax(0, 1fr))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
  ],
}
