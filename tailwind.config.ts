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
      boxShadow: {
        header: '0px 4px 16px 0px #2C30000D',
      },
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio'), require('@tailwindcss/forms')],
} satisfies Config
