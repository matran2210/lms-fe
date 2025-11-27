const tailwindConfig = require('@lms/config-tailwind')

module.exports = {
  ...tailwindConfig,
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // chỉ scan riêng app này
    ...tailwindConfig.content // vẫn giữ scan các libs, features
  ],
}
