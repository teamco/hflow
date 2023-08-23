const ts = +(new Date);

module.exports = {
  bail: 1,
  verbose: true,
  globals: {
    Uint8Array
  },
  setupFiles: [ require('path').resolve('./__tests__/config/globals.jest') ],
  transform: {
    '^.+\\.(ts|tsx)?$': ['ts-jest', { useESM: true }],
    '^.+\\.(js)?$': require('path').resolve('./__tests__/config/babel.jest'),
    '^.+\\.svg$': require('path').resolve('./__tests__/config/svgTransform.js'),
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub'
  },
  transformIgnorePatterns: [
    // '!node_modules/'
  ],
  unmockedModulePathPatterns: [
    '<rootDir>/node_modules/react',
    '<rootDir>/node_modules/react-dom'
  ],
  coverageReporters: ['clover', 'json', 'text', 'lcov', 'cobertura', 'html'],
  reporters: [
    'default', [
      'jest-html-reporters', {
        publicPath: `./__report__/${ts}`,
        filename: 'index.html',
        openReport: true
      }
    ], [
      'jest-junit', {
        outputDirectory: `./__report__/junit/`,
        outputName: 'jest-component.xml',
        ancestorSeparator: ' > ',
        uniqueOutputName: 'false',
        suiteNameTemplate: 'UMI.js Tests',
        classNameTemplate: '{classname}-{title}',
        titleTemplate: '{title}'
      }
    ]
  ],
  testEnvironment: 'jsdom',
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/__tests__/**/*.spec.[jt]s?(x)',
    '!**/__tests__/e2e/*.spec.[jt]s?(x)',
    '!**/__tests__/e2e/**/*.spec.[jt]s?(x)'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    'src/components/*.js',
    '!src/locales/**',
    '!**/node_modules/**',
    '!**/models/**',
    '!**/services/**',
    '!**/utils/**',
    '!**/mock/**',
    '!**/config/**',
    '!**/index.js',
    '!**/src/**/*.index.js',
    '!**/src/**/*.model.js',
    '!**/src/**/*.service.js',
    '!**/src/**/*.connect.js',
    '!**/src/**/*.config.js',
    '!**/src/.umi*',
    '!src/.umi/**',
    '!src/.umi-test/**',
    '!src/.umi-production/**'
  ],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100
    }
  },
  moduleNameMapper: {
    '\\.(css|less|sass|scss|stylus)$': '<rootDir>/node_modules/identity-obj-proxy/src/index.js',
    '^.+.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^umi$': require.resolve('@umijs/max'),
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@@/(.*)$': '<rootDir>/src/.umi/$1',
    '^__tests__/(.*)': '<rootDir>/__tests__/$1'
  }
};
