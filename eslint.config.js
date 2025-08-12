// ESLint v9 flat config
const globals = require('globals');

module.exports = [
  {
    files: ['**/*.{js,mjs,cjs}'],
    ignores: ['node_modules/', 'coverage/', 'dist/', 'build/'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {},
  },
];
