import { defineConfig } from '@umijs/max';

import { proxy } from './config/proxy';
import { routes } from './config/routes';
import { theme } from './config/theme';
import { alias } from './config/alias';
import envs from './config/envs';

const { NODE_ENV } = envs;

const isDevelopment = NODE_ENV === 'development';

const minifier = isDevelopment ? {} : {
  jsMinifier: 'esbuild',
  jsMinifierOptions: {
    minifyWhitespace: true,
    minifyIdentifiers: true,
    minifySyntax: true
  }
};

const shared = {
  react: {
    singleton: true,
    eager: true
  },
  'react-dom': {
    singleton: true,
    eager: true
  }
};

const __config__ = {
  crossorigin: true,
  alias,
  routes,
  proxy,
  model: {},
  base: '/',
  antd: {
    configProvider: {},
    theme
  },
  request: {
    dataField: 'data'
  },
  initialState: {},
  esbuildMinifyIIFE: true,
  codeSplitting: {
    jsStrategy: 'granularChunks'
  },
  mock: {
    // include: ['mock/*.mock.js']
  },
  manifest: {},
  favicons: [
    '/assets/favicon.ico',
    '/assets/favicon-16x16.png',
    '/assets/favicon-32x32.png'
  ],
  locale: {
    default: 'en-US',
    antd: true,
    title: true,
    baseNavigator: false,
    baseSeparator: '-'
  },
  define: { ...envs },
  // devtool: NODE_ENV === 'development' ? 'eval' : false,
  ...minifier,
  clickToComponent: {},
  fastRefresh: true,
  dva: {
    immer: {},
    extraModels: []
  },
  mfsu: {
    // esbuild: true
    mfName: 'getMeHomeLocal',
    remoteName: 'getMeHomeRemote',
    shared
  },
  lessLoader: {
    lessLoaderOptions: {}
  },
  deadCode: {},
  // @link https://umijs.org/docs/max/react-query
  // reactQuery: {},
  extraBabelPlugins: [],
  headScripts: [
      // 'https://upload-widget.cloudinary.com/global/all.js'
  ],
  links: [],
  metas: [],
  plugins: []
};

if (isDevelopment) {
  console.log('\n\n==== CONFIG =====\n');
  console.log(__config__);
  console.log('\n==== /CONFIG =====\n\n');
}

export default defineConfig(__config__);
