import request from 'umi-request';
import { API_CONFIG } from 'services/config/api.config';
import { stub } from './function';
import { successSaveMsg } from '@/utils/message';
import { history } from 'umi';

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
  get: 'get',
  delete: 'post',
  options: 'options',
  post: 'post',
  patch: 'patch',
  put: 'put'
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

const HEADER_TYPE = {
  contentType: 'Content-Type',
  allowOrigin: 'Access-Control-Allow-Origin',
  authorization: 'Authorization'
};

const DEFAULT_HEADERS = {
  [HEADER_TYPE.allowOrigin]: '*',
  accept: ACCEPT_TYPE.json
};

/**
 * @constant
 * @return {{'Access-Control-Allow-Origin': string, accept: string}}
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
  matchers?.forEach((matcher) => {
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
  return direct ? `/${url}` : `${API_NS}/${url}`;
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
    url = adaptUrlToParams(url, args);
  }

  return {
    ...{
      url: adoptUrlToAPI(url, direct),
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
 * @param {boolean} notice
 * @param opts
 * @param [errorHandler]
 * @param [fallbackUrl]
 * @return {Q.Promise<any> | undefined}
 */
function xhr(opts, notice, errorHandler = stub, fallbackUrl = true) {
  const { pathname } = window.location;
  const { url, method } = opts;
  delete opts.url;
  delete opts.method;

  return request[method](url, opts).then((res) => {
    const isEdit = method === METHOD.put;
    notice && [METHOD.post, METHOD.put].includes(method) && successSaveMsg(isEdit);

    return {
      data: res,
      exists: !!res?.id
    };

  }).catch((error) => {
    const _st = setTimeout(() => {
      if (fallbackUrl) {
        handleResponseError(error.response.status, pathname);
      }
      clearTimeout(_st);
    }, 500);

    errorHandler(error);
    console.error(error.response);

    return {
      data: undefined,
      exists: false
    };
  });
}

/**
 * @function
 * @param {string} status
 * @param {string} [referrer]
 */
function handleResponseError(status, referrer) {
  const baseUrl = '/admin/errors';
  const qs = referrer ? `?referrer=${encodeURIComponent(referrer)}` : '';

  switch (status) {
    case 403:
    case 404:
    case 500:
      history.replace(`${baseUrl}/${status}${qs}`);
      break;
    default:
      history.replace(`${baseUrl}/warning${qs}`);
      break;
  }
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
  CONTENT_TYPE,
  HEADER_TYPE
};
