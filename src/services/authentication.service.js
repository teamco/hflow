import request from 'utils/request';
import { API } from 'services/config/api.config';

/**
 * @export
 * @param {string} token
 * @return {string}
 */
export const getXHRToken1 = ({ username = 'andrewp', password = 'password' }) => {
  const opts = request.config({
    url: API.auth.getToken,
    method: 'post'
  });

  return request.xhr({
        ...opts,
        ...{
          data: {
            username,
            password
          }
        }
      }, (error) => {
        console.log(error);
      }
  );
};

export const getXHRToken2 = ({ username = 'andrewp', password = 'password' }) => {
  const opts = request.config({
    url: API.auth.getToken,
    method: 'post',
    headers: {
      'Content-Type': request.CONTENT_TYPE.multipart
    }
  });

  const data = new FormData();
  data.append('username', username);
  data.append('password', password);

  return request.xhr({
        ...opts,
        ...{ data }
      }, (error) => {
        console.log(error);
      }
  );
};

export const getXHRToken3 = ({ username = 'andrewp', password = 'password' }) => {
  const opts = request.config({
    url: API.auth.getToken,
    method: 'post',
    headers: {
      'Content-Type': request.CONTENT_TYPE.urlencoded
    }
  });

  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);

  return request.xhr({
        ...opts, ...{ params }
      }, (error) => {
        console.log(error);
      }
  );
};

/**
 * @export
 * @param token
 * @return {Q.Promise<*>|undefined}
 */
export function getCurrentUser({ token }) {
  const opts = request.config({
    url: API.auth.currentUser,
    headers: { 'Authorization': getXHRToken1({ token }) }
  });

  return request.xhr(opts, (error) => {
        console.log(error);
      },
      '/home'
  );
}
