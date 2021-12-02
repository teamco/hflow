const rimraf = require('rimraf');
const dir = './src/.umi';

rimraf(dir, () => {
  console.log(`Directory: ${dir} deleted successfully`);
});
