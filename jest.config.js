module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    '*.js',
    '!jest.config.js',
    '!coverage/**',
    '!node_modules/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  verbose: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
};
