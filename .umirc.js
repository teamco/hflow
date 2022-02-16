import { defineConfig } from 'umi';
import { routes } from './routes';
import { getProxy } from './proxy';
import { alias } from './alias';

const { HOME_ENV = false } = process.env;

export default defineConfig({
  crossorigin: true,
  alias,
  routes,
  // locale: { antd: true },
  proxy: getProxy(),
  favicon: '/assets/favicon.png',
  locale: {
    default: 'en-US',
    antd: true,
    title: true,
    baseNavigator: false,
    baseSeparator: '-'
  },
  define: {
    HOME_ENV
  },
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
  manifest: {},
  workerLoader: {},
  analyze: {
    analyzerMode: 'server',
    analyzerPort: 8888,
    openAnalyzer: true,
    // generate stats file while ANALYZE_DUMP exist
    generateStatsFile: false,
    statsFilename: 'stats.json',
    logLevel: 'info',
    defaultSizes: 'parsed' // stat // gzip
  }
});

