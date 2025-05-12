import type { Config } from "tailwindcss";
import sharedConfig from "@repo/config-tailwind";

const config: Config = {
  presets: [sharedConfig], //extend config chung từ packages/config-tailwind
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx,scss,css}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      ...sharedConfig.theme?.extend,
    },
  },
  plugins: [...(sharedConfig.plugins || [])],
};

export default config;
