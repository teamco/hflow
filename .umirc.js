import {defineConfig} from 'umi';
import {routes} from './routes';
import {proxy} from './proxy';
import {alias} from './alias';

export default defineConfig({
  crossorigin: true,
  alias,
  routes,
  proxy,
  dynamicImport: {
    loading: '@/components/Loader'
  },
  dynamicImportSyntax: {},
  fastRefresh: {},
  dva: {
    immer: true,
    hmr: true
  },
  mfsu: {},
  lessLoader: {
    lessLoaderOptions: {}
  },
  nodeModulesTransform: {
    type: 'none'
  }
});
