/* eslint-env node */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/(index|serviceWorker|setupTests).*',
    '!src/**/*.(ignored|stories|test).{js,jsx,ts,tsx}',
  ],
  coverageReporters: ['json', 'html', 'lcov'],
};
