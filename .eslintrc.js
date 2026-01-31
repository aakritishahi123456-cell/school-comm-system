module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // Error prevention
    'no-console': 'off', // Allow console.log for server logging
    'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    'no-undef': 'error',
    'no-unreachable': 'error',

    // Code style
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],

    // Best practices
    'eqeqeq': ['error', 'always'],
    'no-var': 'error',
    'prefer-const': 'error',
    'no-trailing-spaces': 'error',
    'eol-last': 'error',

    // Node.js specific
    'no-process-exit': 'off', // Allow process.exit in server code
    'no-path-concat': 'error'
  },
  overrides: [
    {
      files: ['tests/**/*.js'],
      env: {
        jest: true
      },
      rules: {
        'no-unused-expressions': 'off'
      }
    }
  ]
};
