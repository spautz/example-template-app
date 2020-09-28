/* eslint-env node */

const rules = {
  'react/jsx-uses-react': 'error',
  'react/jsx-uses-vars': 'error',
  '@typescript-eslint/no-empty-interface': 'off',
};

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react'],
  extends: ['eslint:recommended', 'prettier/@typescript-eslint'],

  rules,

  overrides: [
    {
      files: ['src/**/*.js', 'src/**/*.jsx', 'src/src/*.ts', 'src/**/*.tsx'],
      env: {
        browser: true,
      },
    },
    {
      files: ['**/*.ts', '**/*.tsx'],
      // Add typescript rules for typescript files only
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
      ],
      rules,
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
