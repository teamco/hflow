const babelJestMd = require('babel-jest');
const babelJest = babelJestMd['__esModule'] ? babelJestMd.default : babelJestMd;

const config = require('./jest.babel.config');

module.exports = babelJest.createTransformer({ ...config, });
