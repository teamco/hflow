import { message } from 'antd';

import request from '@/utils/request';
import { API } from '@/services/config/api.config';
import { stub } from '@/utils/function';

const { METHOD, HEADER_TYPE, CONTENT_TYPE } = request;

/**
 * @constant
 * @param token
 * @return {`Bearer ${string}`}
 */
const getBearer = token => `Bearer ${token.access_token}`;

/**
 * @async
 * @constant
 * @param error
 * @param notice
 * @return {Promise<void>}
 */
const handleError = async (error, notice) => {
  notice && (await message.error(error.message));
};

/**
 * @export
 * @async
 * @param [props]
 * @return {GlobalConfig.Promise<*>|undefined}
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
    expiredAt,
    credentials: {
      username = 'guest',
      password = 'guest'
    },
    updateState = stub
  } = token;

  /**
   * @function
   * @param {string} url
   * @param {boolean} [refresh]
   * @return {Bluebird.Promise<*>|undefined}
   * @private
   */
  function _handleToken(url, refresh = false) {
    const opts = request.config({
      url,
      method: request.METHOD.post
    });

    if (refresh) {
      opts.headers = {
        [HEADER_TYPE.authorization]: getBearer(refresh_token)
      };
    }

    const data = request.formData({ username, password });

    return request.xhr({
          ...opts,
          ...{ data }
        },
        notice,
        async (error) => await handleError(error, notice)
    );
  }

  let tokenData = { data: { ...token } };

  if (access_token) {
    if (+(new Date) > expiredAt) {
      // Expired
      tokenData = await _handleToken(API.auth.refresh, true);
      debugger
      updateState({});
    }
  } else if (guest?.access_token) {
    tokenData = { data: { access_token: guest.access_token } };
  } else {
    tokenData = await _handleToken(API.auth.token);
  }

  return tokenData;
};

/**
 * @async
 * @export
 * @param props
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 * @example
 * updateFeature = async ({ id, data }) => {
 *   return xhrRequest({
 *     url: API.features.get,
 *     method: request.METHOD.put,
 *     featureKey: id,
 *     data
 *   });
 * };
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

  const opts = request.config({
    url,
    method,
    headers: {
      [HEADER_TYPE.authorization]: getBearer({ access_token }),
      [HEADER_TYPE.contentType]: CONTENT_TYPE.json
    },
    ...args
  });

  return request.xhr({
        ...opts,
        ...{ data }
      },
      notice,
      async (error) => await handleError(error, notice)
  );
};

/**
 * @export
 * @async
 * @param {string} uid
 * @param {string} token
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const createServerProfile = async ({ uid, token }) => {
  return xhrRequest({
    url: API.users.get,
    userKey: uid,
    token
  });
};
