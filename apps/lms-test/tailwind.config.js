/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
const tailwindConfig = require("@lms/config-tailwind");

module.exports = {
  presets: [tailwindConfig],
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../features/*/src/**/*.{js,ts,jsx,tsx}",
    "../../libs/ui/**/*.{js,ts,jsx,tsx}",
    "../../libs/core/**/*.{js,ts,jsx,tsx}",
    "../../libs/hooks/**/*.{js,ts,jsx,tsx}",
    "../../libs/utils/**/*.{js,ts,jsx,tsx}",
    "../../libs/assets/**/*.{js,ts,jsx,tsx}",
    "../../libs/state/**/*.{js,ts,jsx,tsx}",
    "../../libs/HOC/src/**/*.{js,ts,jsx,tsx}",
    "!../../libs/**/node_modules/**",
    "!../../features/**/node_modules/**",
  ],
};
