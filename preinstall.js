const fs = require('fs');
const path = require('path');

const dir = './src/.umi';

fs.rmdir(dir, {recursive: true, force: true}, (err) => {
  if (err) {
    return console.warn('Error occurred in deleting directory', err);
  }

  console.log(`Directory: ${dir} deleted successfully`);
});
