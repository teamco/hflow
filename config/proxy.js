const colors = require('colors');

const { RUNTIME_CONFIG } = require('../src/services/config/runtime.config');
const { API } = require('../src/services/config/api.config');
const { cloudinaryAPI } = require('../src/services/config/cloudinary.config');

const { NODE_ENV, CORPORATE_PROXY } = process.env;

let { SERVER_URL, SERVER_PORT, API_NS } = RUNTIME_CONFIG();

if (CORPORATE_PROXY) {
  SERVER_URL = null;
}

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
  target: `${SERVER_URL}:${SERVER_PORT}/`,
  ...debugProps(isDevelopment)
};

const _proxy = CORPORATE_PROXY ? {} : {
  [`${API_NS}/${API.auth.token}`]: { ...proxyPops },
  [`${API_NS}/${API.auth.refresh}`]: { ...proxyPops },
  [`${API_NS}/${API.users.store}`]: { ...proxyPops },
  [`${API_NS}/${API.features.store}`]: { ...proxyPops },
  [`${API_NS}/${API.campaigns.store}`]: { ...proxyPops },
  [`${API_NS}/${API.schedulers.store}`]: { ...proxyPops },
  [`${API_NS}/${API.apartments.store}`]: { ...proxyPops },
  [`${API_NS}/${API.addresses.store}`]: { ...proxyPops },
  [`${API_NS}/${API.views.store}`]: { ...proxyPops },
  [`${API_NS}/${API.likes.store}`]: { ...proxyPops },
  [`${API_NS}/${API.subscriptions.store}`]: { ...proxyPops },
  [`${API_NS}/${cloudinaryAPI.signature}`]: { ...proxyPops },
};

/**
 * @export
 * @constant
 * @return {{[p: string]: {onProxyRes(*, *, *): void, onError(*, *, *): void, logLevel: string, changeOrigin: boolean,
 *     secure: boolean, ws: boolean, pathRewrite(*, *): void, onProxyReq(*, *, *): void, target: string}|{onProxyRes(*,
 *     *, *): void, onError(*, *, *): void, logLevel: string, changeOrigin: boolean, secure: boolean, ws: boolean,
 *     pathRewrite(*, *): void, onProxyReq(*, *, *): void, target: string}}}
 */
const getProxy = () => {
  console.log('\n\n==== PROXY =====\n');
  console.log(colors.green('NODE_ENV:'), NODE_ENV);
  console.log(colors.green('SERVER_URL:'), `${SERVER_URL}:${SERVER_PORT}`);
  console.log(colors.cyan('Under corporate proxy?'), `[${CORPORATE_PROXY ? 'Yes' : 'No'}]\n`);
  isDevelopment && console.log(colors.green('PROXY:'), _proxy);
  console.log('\n==== /PROXY =====\n\n');

  return _proxy;
};

module.exports = { proxy: getProxy() };