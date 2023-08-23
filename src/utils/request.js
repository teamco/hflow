import { request, history } from '@umijs/max';

import { stub } from '@/utils/function';
import { isHost } from '@/utils/window';
import { logger } from '@/utils/console';
import { successDeleteMsg, successSaveMsg } from '@/utils/message';

import { API } from '@/services/config/api.config';

const { RUNTIME_CONFIG } = require('@/services/config/runtime.config');

/**
 * @constant
 * @type {{API_NS, ADMIN_NS}}
 */
const { API_NS, ADMIN_NS } = RUNTIME_CONFIG();

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
  delete: 'delete',
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

let skipNotificationOn = [];

skipNotificationOn.push(`${API_NS}/${API.auth.refresh}`);
skipNotificationOn.push(`${API_NS}/${API.auth.token}`);

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
function adaptUrlToParams(url, args) {
  let _url = url;
  const matchers = _url.match(/:\w+/g);
  matchers?.forEach((matcher) => {
    const instance = matcher.replace(':', '');
    _url = _url.replace(new RegExp(matcher), args[instance]);
  });

  return _url;
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
 * @param props
 * @return {{headers, method: string, url: *}}
 */
function config(props) {
  let {
    url = '',
    method = METHOD.get,
    headers = {},
    direct = false,
    responseType = 'json',
    ...args
  } = props;

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
 * @param {function(any): Promise<{data}>} [errorHandler]
 * @param [fallbackUrl]
 * @return {Promise<T | {data: {error: *}, exists: boolean}>}
 */
function xhr(opts, notice, errorHandler = stub, fallbackUrl = true) {
  const { pathname } = window.location;
  const { url, method } = opts;

  delete opts.url;

  return request(url, opts).then((res) => {
    const isEdit = method === METHOD.put ||
        (opts?.data || [])[0]?.operation === 'Update';

    const isDelete = [METHOD.delete].includes(method) ||
        (opts?.data || [])[0]?.operation === 'Delete';

    if (notice) {
      let showMsg = stub;
      if ([METHOD.post, METHOD.put].includes(method)) {
        if (isDelete) {
          showMsg = async () => successDeleteMsg();
        } else {
          showMsg = async () => successSaveMsg(isEdit);
        }
      } else if (isDelete) {
        showMsg = async () => successDeleteMsg();
      }

      if (skipNotificationOn.indexOf(url) === -1) {
        showMsg();
      }
    }

    return {
      data: res,
      exists: !!res?.id
    };

  }).catch((error) => {

    const _st = setTimeout(async () => {
      if (fallbackUrl) {
        await handleResponseError(error.code, error.message,
            error?.response?.status, pathname);
      }
      clearTimeout(_st);
    }, 1000);

    errorHandler(error);
    console.error(error.response);

    return {
      data: { error },
      exists: false
    };
  });
}

/**
 * @memberOf xhr
 * @param messageApi
 * @param intl
 */
xhr.addMessageApi = (messageApi, intl) => {
  xhr.notification = {
    ...(xhr.notification || {}),
    messageApi,
    intl
  };
};

/**
 * @function
 * @async
 * @param {string} code
 * @param {string} error
 * @param {string} status
 * @param {string} [referrer]
 */
async function handleResponseError(code, error, status, referrer) {
  const baseUrl = isHost(ADMIN_NS) ? `${ADMIN_NS}/errors` : '/errors';
  const qs = referrer ? `?referrer=${encodeURIComponent(referrer)}` : '';
  logger({ type: 'warn', code });

  let errorUrl;

  switch (status) {
    case 403:
    case 404:
    case 500:
      errorUrl = `${baseUrl}/${status}${qs}`;
      break;
    default:
      errorUrl = `${baseUrl}/warning${qs}`;
      break;
  }

  if (CORPORATE_PROXY) {
    logger({ type: 'info', CORPORATE_PROXY });
  } else {
    history.replace(errorUrl);
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
