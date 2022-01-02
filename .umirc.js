import { defineConfig } from 'umi';
import { routes } from './routes';
import { getProxy } from './proxy';
import { alias } from './alias';

export default defineConfig({
  crossorigin: true,
  alias,
  routes,
  // locale: { antd: true },
  proxy: getProxy(),
  favicon: '/assets/favicon.png',
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
  extraBabelPlugins: [],
  nodeModulesTransform: {
    type: 'none'
  },
  headScripts: [],
  plugins: [],
  manifest: {}
});

