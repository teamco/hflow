const { rimraf } = require('rimraf');
const dir = './src/.umi';

rimraf(dir).then(() => {
  console.log(`Directory: ${dir} deleted successfully`);
});
