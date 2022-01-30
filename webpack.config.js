module.exports = {
  resolve: {
    alias: {
      '@': require('path').resolve(__dirname, 'src'),
      '@@': require('path').resolve(__dirname, 'src/.umi'),
      '__tests__': require('path').resolve(__dirname, '__tests__')
    }
  }
};
