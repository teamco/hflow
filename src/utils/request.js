import request from 'umi-request';
import { API_CONFIG } from 'services/config/api.config';

/**
 * @constant
 * @type {{API_NS}}
 */
const { API_NS } = API_CONFIG();

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

const METHOD = {
  get: 'GET',
  delete: 'DELETE',
  options: 'OPTIONS',
  post: 'POST',
  patch: 'PATCH',
  put: 'PUT'
};

/**
 * @constant
 * @type {{urlencoded: string, multipart: (function({_boundary: string}): string), json: string}}
 */
const CONTENT_TYPE = {
  json: 'application/json;charset=UTF-8',
  urlencoded: 'application/x-www-form-urlencoded',

  /**
   * @example
   * const form = new FormData();
   * form.append(item.name, fs.createReadStream(pathToFile));
   */
  multipart: `multipart/form-data`
};

const ACCEPT_TYPE = {
  all: '*/*',
  json: 'application/json'
};

const DEFAULT_HEADERS = {
  'Content-Type': CONTENT_TYPE.json,
  'Access-Control-Allow-Origin': '*',
  accept: ACCEPT_TYPE.json
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
  return direct ? `/${url}` : `/${API_NS}/${url}`;
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
  method = METHOD.get,
  headers = {},
  direct = false,
  responseType = 'json',
  ...args
}) {

  if (url.match(/:(\w+)Key/)) {
    //url = adaptUrlToParams(url, args);
  }

  return {
    ...{
      url: `http://localhost:8003/api/v1/${url}`,//: adoptUrlToAPI(url, direct),
      method,
      responseType,
      headers: { ...mergeHeaders(), ...headers }
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
  const { pathname } = window.location;
  const { url, method } = opts;
  delete opts.url;
  delete opts.method;

  return request[method](url, opts).then((res) => ({ data: { ...res } })).catch((error) => {
    const _st = setTimeout(() => {
      if (fallbackUrl && !pathname.match(new RegExp(fallbackUrl))) {
        //history.replace(`${fallbackUrl}?ref=${encodeURIComponent(pathname)}`);
      }
      clearTimeout(_st);
    }, 2000);

    return error;
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

/**
 * @constant
 * @param json
 * @param Handler
 * @return {*}
 * @private
 */
const _xhrData = (json, Handler) => {
  const data = new Handler();
  Object.keys(json).forEach(key => (data.append(key, json[key])));
  return data;
};

/**
 * @export
 * @param json
 * @return {FormData}
 */
const formData = json => {
  return _xhrData(json, FormData);
};

/**
 * @export
 * @param json
 * @return {URLSearchParams}
 */
const paramsData = json => {
  return _xhrData(json, URLSearchParams);
};

export default {
  xhr,
  formData,
  paramsData,
  config,
  toBase64,
  isSuccess,
  METHOD,
  ACCEPT_TYPE,
  CONTENT_TYPE
};
