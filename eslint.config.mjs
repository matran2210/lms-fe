import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Cấu hình cho tất cả các file JS, JSX, TS, TSX
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,

  // Tắt yêu cầu import React trong JSX
  {
    rules: {
      "react/react-in-jsx-scope": "off", // Tắt rule này
    },
    settings: {
      react: {
        version: "detect", // ESLint sẽ tự động phát hiện phiên bản React
      },
    },
  },
]);
