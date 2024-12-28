module.exports = {
  env: {
    node: true, // Enables Node.js global variables and Node.js scoping
    es2021: false, // Supports ES2021 features
  },
  extends: [
    'eslint:recommended', // Base recommended ESLint rules
    'plugin:node/recommended', // Adds support for Node.js-specific linting
  ],
  parserOptions: {
    ecmaVersion: 12, // Allows parsing of modern ECMAScript features
  },
  rules: {
    // Allow using CommonJS instead of ES Modules
    'node/no-unsupported-features/es-syntax': [
      'error',
      { ignores: ['modules'] },
    ],

    // Best practices for Express, Mongoose, and Socket.IO
    'no-console': 'off', // Allow console.log for debugging
    'node/no-unpublished-require': 'off', // Allow requiring local files not published to npm
    'node/no-missing-require': 'off', // Suppress missing require for dynamic paths
    'no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^ignored' },
    ], // Ignore unused arguments prefixed with `_`

    // Style and best practices
    'semi': ['error', 'always'], // Enforce semicolons
    'quotes': ['error', 'single', { avoidEscape: true }], // Prefer single quotes
    'indent': ['error', 2], // Enforce 2-space indentation
    'comma-dangle': ['error', 'always-multiline'], // Enforce trailing commas for multiline
    'arrow-body-style': ['error', 'as-needed'], // Enforce concise arrow function bodies
    'prefer-const': 'warn', // Prefer `const` over `let` where possible
  },
  settings: {
    node: {
      tryExtensions: ['.js', '.json', '.node'], // Extensions to check for module resolution
    },
  },
};

