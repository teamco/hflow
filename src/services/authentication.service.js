import * as request from '@/utils/request';

import { useDispatcher } from '@/services/common.service';

const { API } = require('@/services/config/api.config');
const {
  xhr,
  config,
  formData,
  METHOD,
  HEADER_TYPE,
  CONTENT_TYPE
} = request.default;

/**
 * @constant
 * @param expiredAt
 * @return {boolean}
 */
const isExpired = (expiredAt) => +(new Date) > expiredAt;

/**
 * @constant
 * @param {string} token
 * @return {`Bearer ${string}`}
 */
const getBearer = (token) => `Bearer ${token}`;

/**
 * @async
 * @constant
 * @param error
 * @param notice
 * @return {Promise<{data}>}
 */
const handleError = async (error, notice) => {
  if (notice) {
    console.error(error);
  }
  return { data: { error } };
};

/**
 * @export
 * @async
 * @param [props]
 * @return {Promise<{data}|{data: {credentials: {}}}>}
 */
export const getXHRToken = async (props = {}) => {
  const {
    token = { credentials: {} },
    notice = false
  } = props;

  const {
    guest,
    access_token,
    refresh_token,
    expiredAt
  } = token;

  const {
    username = 'guest',
    password = 'guest'
  } = token?.credentials || {};

  /**
   * @function
   * @param {string} url
   * @param {boolean} [refresh]
   * @return {Promise<T|{data: {error: *}, exists: boolean}>}
   * @private
   */
  function _handleToken(url, refresh = false) {
    const opts = config({
      url,
      method: METHOD.post
    });

    let data = {};

    if (refresh) {
      opts.headers = {
        [HEADER_TYPE.authorization]: getBearer(refresh_token)
      };
    } else {
      data = formData({ username, password });
    }

    return xhr({
          ...opts,
          ...{ data }
        },
        notice,
        async (error) => handleError(error, notice)
    );
  }

  let tokenData = { data: { ...token } };

  if (access_token) {
    if (isExpired(expiredAt)) {
      // Expired
      tokenData = await _handleToken(API.auth.refresh, true);

      if (tokenData?.data?.error) {
        return handleError(tokenData?.data?.error, notice);
      }
    }
  } else if (guest?.access_token) {
    tokenData = { data: { access_token: guest.access_token } };
  } else {
    tokenData = await _handleToken(API.auth.token);
  }

  const dispatch = useDispatcher();

  dispatch({ type: 'authModel/updateState', payload: { token: { ...tokenData?.data } } });

  return tokenData;
};

/**
 * @async
 * @export
 * @param props
 * @example
 * updateFeature = async ({ id, data }) => {
 *   return xhrRequest({
 *     url: API.features.get,
 *     method: request.METHOD.put,
 *     featureKey: id,
 *     data
 *   });
 * };
 * @return {Promise<T|{data: {error: *}, exists: boolean}>}
 */
export const xhrRequest = async (props) => {
  let {
    url,
    data = {},
    method = METHOD.post,
    notice = true,
    token,
    ...args
  } = props;

  const { data: { access_token } } = await getXHRToken({ token, notice });

  const opts = config({
    url,
    method,
    headers: {
      [HEADER_TYPE.authorization]: getBearer(access_token),
      [HEADER_TYPE.contentType]: CONTENT_TYPE.json
    },
    ...args
  });

  return xhr({
        ...opts,
        ...{ data }
      },
      notice,
      async (error) => handleError(error, notice)
  );
};

/**
 * @export
 * @async
 * @param {string} uid
 * @param {string} token
 * @return {Promise<T|{data: {error: *}, exists: boolean}>}
 */
export const createServerProfile = async ({ uid, token }) => {
  return xhrRequest({
    url: API.users.get,
    userKey: uid,
    token
  });
};
