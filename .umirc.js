import {defineConfig} from 'umi';
import routes from './routes';
import proxy from './proxy';

const path = require('path');

/**
 * @function
 * @param alias
 * @return {string}
 * @private
 */
function _resolve(alias) {
  return path.resolve(__dirname, alias);
}

const fs = require('fs');

/**
 * @function
 * @param dir
 * @param files_
 * @return {*[]}
 */
function getFiles(dir, files_) {
  files_ = files_ || [];
  const files = fs.readdirSync(dir);
  for (let i in files) {
    const name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else {
      if (name.match(/.model/)) {
        files_.push(name);
      }
    }
  }
  return files_;
}

const widgetsPath = `${__dirname}/src/vendors/widgets`;
const extraModels = getFiles(widgetsPath);

export default defineConfig({
  crossorigin: true,
  routes,
  proxy,
  dynamicImport: {
    loading: '@/components/Loader'
  },
  dynamicImportSyntax: {},
  fastRefresh: {},
  dva: {
    extraModels,
    immer: true,
    hmr: true
  },
  mfsu: {},
  lessLoader: {
    lessLoaderOptions: {}
  },
  nodeModulesTransform: {
    type: 'none'
  },
  alias: {
    '@': _resolve('src')
  }
});
