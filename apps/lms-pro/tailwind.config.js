const tailwindConfig = require('@lms/config-tailwind')

module.exports = {
  presets: [tailwindConfig],
  content: [
    // App source
    './src/**/*.{ts,tsx}',
    // Features đều có src/
    '../../features/*/src/**/*.{ts,tsx}',
    // Libs — không có src/ chuẩn, scan root nhưng exclude node_modules
    '../../libs/ui/**/*.{ts,tsx}',
    '../../libs/core/**/*.{ts,tsx}',
    '../../libs/hooks/**/*.{ts,tsx}',
    '../../libs/utils/**/*.{ts,tsx}',
    '../../libs/assets/**/*.{ts,tsx}',
    '../../libs/state/**/*.{ts,tsx}',
    '../../libs/HOC/src/**/*.{ts,tsx}',
    // Exclude node_modules
    '!../../libs/**/node_modules/**',
    '!../../features/**/node_modules/**',
  ],
}
