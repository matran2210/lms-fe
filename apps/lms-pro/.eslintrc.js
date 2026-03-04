module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'no-empty': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'no-extra-boolean-cast': 'off',
    'no-case-declarations': 'off',
    '@typescript-eslint/ban-types': 'off', // bỏ qua lỗi Object type
    'no-prototype-builtins': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-dupe-else-if': 'off',
    'prefer-const': 'off',
    'no-empty-pattern': 'off',
    'no-useless-escape': 'off',
    'no-var': 'off',
    'react-hooks/exhaustive-deps': 'off',
    '@next/next/no-img-element': 'off',
    "no-unsafe-optional-chaining": "off"
  },
}
