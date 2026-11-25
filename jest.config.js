/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  // Native ESM — no Babel transform (package.json has "type": "module")
  transform: {},
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/.internal/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'text-summary'],
  // Focus Part 2 UT on the Top-10 prioritized files (Test Plan §4.4)
  coveragePathIgnorePatterns: ['/node_modules/', '/src/\\.internal/'],
  verbose: true,
}

export default config
