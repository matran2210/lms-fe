import type { Config } from "tailwindcss";
import sharedConfig from "@repo/config-tailwind";

const config: Config = {
  content: [
    ...sharedConfig.content, // Nội dung từ sharedConfig
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Thêm cấu hình riêng của dự án
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: sharedConfig.theme?.extend || {}, // Kết hợp theme mở rộng từ sharedConfig
  },
  plugins: sharedConfig.plugins || [], // Thêm plugins từ sharedConfig
};

export default config;
