import colors from 'colors';

import { API, API_CONFIG } from './src/services/config/api.config';

const { NODE_ENV, UMI_VERSION } = process.env;

/**
 * @constant
 * @type {{
 *  SERVER_URL,
 *  SERVER_PORT,
 *  API_NS
 * }}
 */
const apiConfig = API_CONFIG();

const { SERVER_URL, SERVER_PORT, API_NS } = apiConfig;

/**
 * @constant
 * @param {boolean} [debug]
 * @return {{onProxyRes(*, *, *): void, onError(*, *, *): void, logLevel: string, pathRewrite(*, *): void,
 *     onProxyReq(*, *, *): void}}
 */
const debugProps = (debug = true) => {
  return debug ? {
    logLevel: 'debug',
    pathRewrite(path, req) {
      console.info(path, req.url);
    },
    onError(err, req, res) {
      console.error(err);
      res.status(500);
      res.json({ error: 'Error when connecting to remote server.' });
    },
    onProxyReq(proxyReq, req, res) {
      console.info('onProxyReq', proxyReq.host);
    },
    onProxyRes(proxyRes, req, res) {
      console.log('onProxyRes', proxyRes.host);
    }
  } : {};
};

const isDevelopment = NODE_ENV === 'development';

const proxyPops = {
  changeOrigin: true,
  secure: false,
  ws: false,
  target: `${SERVER_URL}`,
  ...debugProps(isDevelopment)
};

const _proxy = {
  [`${API_NS}/${API.auth.getToken}`]: { ...proxyPops },
  [`${API_NS}/${API.features.store}`]: { ...proxyPops }
};

/**
 * @export
 * @constant
 * @return {{[p: string]: {onProxyRes(*, *, *): void, onError(*, *, *): void, logLevel: string, changeOrigin: boolean, secure: boolean, ws: boolean, pathRewrite(*, *): void, onProxyReq(*, *, *): void, target: string}|{onProxyRes(*, *, *): void, onError(*, *, *): void, logLevel: string, changeOrigin: boolean, secure: boolean, ws: boolean, pathRewrite(*, *): void, onProxyReq(*, *, *): void, target: string}}}
 */
export const getProxy = () => {
  console.log('\n\n==== CONFIG =====\n');
  console.log(colors.green('NODE_ENV:'), NODE_ENV);
  console.log(colors.green('UMI_VERSION:'), UMI_VERSION);
  isDevelopment && console.log(colors.green('PROXY:'), _proxy);
  console.log('\n==== /CONFIG =====\n\n');

  return _proxy;
};

