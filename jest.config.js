module.exports = {
  testPathIgnorePatterns: ['<rootDir>/cypress/'],
  moduleNameMapper(memo) {
    return {
      ...memo,
      '^umi$': require.resolve('umi'),
      '^@/(.*)': '<rootDir>/src/$1',
      '^__tests__/(.*)': '<rootDir>/__tests__/$1'
    };
  }
};
