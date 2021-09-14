import request from 'umi-request';
import {API_CONFIG} from '@/services/config';

/**
 * @constant
 * @type {{SERVER_PORT: number, API: string, SERVER_URL: string, ANTHILL_KEY: string}}
 */
const apiConfig = API_CONFIG();

/**
 * @function
 * @return {string}
 * @private
 */
function _csrfParam() {
  const meta = document.querySelector('meta[name="csrf-param"]');
  return meta.getAttribute('content');
}

/**
 * @function
 * @return {string}
 * @private
 */
function _csrfToken() {
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta.getAttribute('content');
}

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json;charset=UTF-8',
  'Access-Control-Allow-Origin': '*',
  accept: 'application/json'
};

/**
 * @constant
 * @return {{'Access-Control-Allow-Origin': string, 'Content-Type': string, accept: string}}
 */
const mergeHeaders = () => {
  // DEFAULT_HEADERS['X-CSRF-Token'] = _csrfToken();
  return DEFAULT_HEADERS;
};

/**
 * @function
 * @param {string} url
 * @param args
 * @return {string}
 */
function adaptUrlToParams(url = '', args) {
  const matchers = url.match(/:\w+/g);
  matchers &&
  matchers.forEach((matcher) => {
    const instance = matcher.replace(':', '');
    url = url.replace(new RegExp(matcher), args[instance]);
  });

  return url;
}

/**
 * @function
 * @param url
 * @param {boolean} [direct]
 * @return {string}
 */
function adoptUrlToAPI(url, direct = false) {
  return direct ? `/${url}` : `/${apiConfig.API}/${url}`;
}

/**
 * @function
 * @param {string} url
 * @param {string} [method]
 * @param [headers]
 * @param {boolean} [direct]
 * @param {string} [responseType]
 * @param [args]
 * @return {{headers, method: string, url: *}}
 */
function config({
  url = '',
  method = 'get',
  headers = {},
  direct = false,
  responseType = 'json',
  ...args
}) {

  if (url.match(/:(\w+)Key/)) {
    url = adaptUrlToParams(url, args);
  }

  return {
    ...{
      url: adoptUrlToAPI(url, direct),
      method,
      responseType,
      headers: {...mergeHeaders(), ...headers}
    },
    ...args
  };
}

/**
 * @function
 * @param file
 * @return {Promise<unknown>}
 */
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * @function
 * @param opts
 * @param [errorMsg]
 * @param [fallbackUrl]
 * @return {Q.Promise<any> | undefined}
 */
function xhr(opts, errorMsg, fallbackUrl) {
  const {pathname} = window.location;
  const {url, method} = opts;
  delete opts.url;
  delete opts.method;

  return request[method](url, opts).then((res) => ({data: {...res}})).catch((error) => {
    errorMsg && errorMsg(error?.data?.error);
    setTimeout(() => {
      if (fallbackUrl && !pathname.match(new RegExp(fallbackUrl))) {
        //history.replace(`${fallbackUrl}?ref=${encodeURIComponent(pathname)}`);
      }
    }, 2000);

    return error?.response;
  });
}

/**
 * @function
 * @param status
 * @return {boolean}
 */
function isSuccess(status) {
  return [200, 201, 202, 203, 204].indexOf(status) > -1;
}

export default {
  xhr,
  config,
  toBase64,
  isSuccess,
  apiConfig,
  adoptUrlToAPI
};
