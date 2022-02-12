/**
 * @export
 * @return {{
 *  SERVER_URL,
 *  ADMIN_URL,
 *  UI_URL,
 *  SERVER_PORT,
 *  ADMIN_PORT,
 *  UI_PORT,
 *  METHODS,
 *  API_NS
 * }}
 * @constant
 */
export const API_CONFIG = () => {

  /**
   * API definition
   * @type {{
   *  SERVER_URL,
   *  ADMIN_URL,
   *  UI_URL,
   *  SERVER_PORT,
   *  ADMIN_PORT,
   *  UI_PORT,
   *  API_NS
   * }}
   */
  const {
    SERVER_URL = 'https://get-me-home-searcher.herokuapp.com',
    ADMIN_URL = 'http://localhost',
    UI_URL = 'http://localhost',
    SERVER_PORT = 80,
    ADMIN_PORT = 8001,
    UI_PORT = 8003,
    API_NS = '/api/v1'
  } = process.env;

  return {
    SERVER_URL,
    ADMIN_URL,
    UI_URL,
    SERVER_PORT,
    ADMIN_PORT,
    UI_PORT,
    API_NS
  };
};

export const API = {
  auth: {
    token: 'authenticate',
    refresh: 'token'
  },
  users: {
    get: 'users/:userKey',
    store: 'users'
  },
  features: {
    get: 'features/:featureKey',
    store: 'features'
  },
  campaigns: {
    get: 'campaigns/:campaignKey',
    store: 'campaigns'
  },
  subscriptions: {
    get: 'subscriptions/:subscriptionKey',
    store: 'subscriptions'
  }
};

