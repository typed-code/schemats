// eslint-disable-next-line no-undef
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.[j|t]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
};
