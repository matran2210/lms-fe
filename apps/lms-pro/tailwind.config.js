const tailwindConfig = require('@lms/config-tailwind')

module.exports = {
  presets: [tailwindConfig],
  content: [
    // App source files
    './src/**/*.{js,jsx,ts,tsx}',
    // Workspace packages - only scan src directories, exclude node_modules
    '../../features/*/src/**/*.{js,jsx,ts,tsx}',
    '../../libs/*/src/**/*.{js,jsx,ts,tsx}',
  ],
}
