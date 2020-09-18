/* eslint-env node */

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react'],
  extends: [
    'eslint:recommended',
    'prettier/@typescript-eslint',
    // 'react-app',
  ],

  rules: {
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
  },

  overrides: [
    {
      files: ['src/**/*.js', 'src/**/*.jsx', 'src/src/*.ts', 'src/**/*.tsx'],
      env: {
        browser: true,
      },
    },
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        // 'react-app',
      ],
    },
    {
      files: ['**/*.test.*', '**/tests/*.*'],
      env: {
        jest: true,
      },
    },
  ],

  ignorePatterns: ['build/', 'coverage/', 'node_modules/', 'storybook-static/'],
};
