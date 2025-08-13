import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        shade: {
          secondary: '#404041',
        },
        icon: '#1C274C',
      },
      backgroundColor: {
        'floating-user': 'rgba(255, 255, 255, 0.08)',
      },
      backdropBlur: {
        'floating-user': 'blur(17.4)',
      },
      boxShadow: {
        header: '0px 4px 16px 0px #2C30000D',
      },
      screens: {
        umd: '769px',
        ulg: '1025px',
      },
      spacing: {
        'header-height': 'var(--header-height)',
      },
    },
  },
  important: '#zoom-app',
  plugins: [require('@tailwindcss/aspect-ratio'), require('@tailwindcss/forms')],
} satisfies Config
