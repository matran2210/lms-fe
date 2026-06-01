module.exports = {
  root: true,

  parser: "@typescript-eslint/parser",

  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },

  plugins: ["@typescript-eslint"],

  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "next/core-web-vitals",
  ],

  ignorePatterns: [".eslintrc.js", "next-env.d.ts", "node_modules/", ".next/"],

  rules: {
    "@next/next/no-html-link-for-pages": "off", // fix lỗi pages dir

    "@typescript-eslint/no-explicit-any": "off",
    "no-empty": "off",
    "@typescript-eslint/no-empty-function": "off",
    "no-extra-boolean-cast": "off",
    "no-case-declarations": "off",
    "@typescript-eslint/ban-types": "off",
    "no-prototype-builtins": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "no-dupe-else-if": "off",
    "prefer-const": "off",
    "no-empty-pattern": "off",
    "no-useless-escape": "off",
    "no-var": "off",
  },
};
