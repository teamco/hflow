// const fs = require('fs');

// const defaultConfig = JSON.parse(fs.readFileSync('./public/config/data.json', 'utf8'));
// const NODE_ENV = defaultConfig['NODE_ENV'];

// const apiServer = defaultConfig['API_SERVER'];

// if (NODE_ENV === 'development') {
//   console.log('\nUI SERVER:          ', apiServer);
// }

import { API_CONFIG } from './src/services/config/api.config';

/**
 * @constant
 * @type {{
 *  SERVER_URL,
 *  ADMIN_URL,
 *  UI_URL,
 *  SERVER_PORT,
 *  ADMIN_PORT,
 *  UI_PORT,
 *  API
 * }}
 */
const apiConfig = API_CONFIG();

const { SERVER_URL, API_NS } = apiConfig;

export const proxy = {
  '/api/v1/authenticate': {
    target: SERVER_URL,
    changeOrigin: true,
    secure: false,
    logLevel: 'debug',
    ws: false,
    pathRewrite(path, req) {
      console.info(path, req);
    },
    onError(err, req, res) {
      console.error(err);
      res.status(500);
      res.json({ error: 'Error when connecting to remote server.' });
    },
    onProxyReq(proxyReq, req, res) {
      console.info('onProxyReq', proxyReq.headers);
    },
    onProxyRes(proxyRes, req, res) {
      console.log('onProxyRes', proxyRes);
    }
  }
};
