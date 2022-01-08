import { message } from 'antd';

import request from 'utils/request';
import { API } from 'services/config/api.config';

const { METHOD, HEADER_TYPE, CONTENT_TYPE } = request;

/**
 * @constant
 * @param token
 * @return {`Bearer ${string}`}
 */
const getBearer = token => `Bearer ${token.data.access_token}`;

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
 * @param props
 * @return {GlobalConfig.Promise<*>|undefined}
 */
export const getXHRToken = (props) => {
  const {
    username = 'andrewp',
    password = 'password',
    notice
  } = props;

  const opts = request.config({
    url: API.auth.getToken,
    method: request.METHOD.post
  });

  const data = request.formData({ username, password });

  return request.xhr({
        ...opts,
        ...{ data }
      },
      false,
      async (error) => await handleError(error, notice)
  );
};

/**
 * @async
 * @export
 * @param props
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const xhrRequest = async (props) => {
  const {
    url,
    data = {},
    user,
    password,
    method = METHOD.post,
    notice = true,
    ...args
  } = props;

  const token = await getXHRToken({ user, password, notice });

  const opts = request.config({
    url,
    method,
    headers: {
      [HEADER_TYPE.authorization]: getBearer(token),
      [HEADER_TYPE.contentType]: CONTENT_TYPE.json
    },
    ...args
  });

  return request.xhr( {
        ...opts,
        ...{ data }
      },
      notice,
      async (error) => await handleError(error, notice)
  );
};
