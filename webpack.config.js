/**
 * @function
 * @param {string} path
 * @returns {string}
 * @private
 */
function _resolve(path) {
  return require('path').resolve(__dirname, path);
}

module.exports = {
  resolve: {
    alias: {
      '@': _resolve('src'),
      '@@': _resolve('src/.umi'),
      'worker': _resolve('public/worker'),
      'assets': _resolve('public/assets'),
      '__tests__': _resolve('__tests__')
    }
  }
};
