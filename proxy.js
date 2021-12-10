import { API_CONFIG } from './src/services/config/api.config';

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

const proxyPops = {
  changeOrigin: true,
  secure: false,
  logLevel: 'debug',
  ws: false,
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
}

export const proxy = {
  [`${API_NS}/authenticate`]: {
    target: `${SERVER_URL}`,
    ...proxyPops
  }
};
