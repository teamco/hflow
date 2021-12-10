import request from 'utils/request';
import { API } from 'services/config/api.config';

/**
 * @export
 * @param props
 * @return {GlobalConfig.Promise<*>|undefined}
 */
export const getXHRToken = (props) => {
  const {
    username = 'andrewp',
    password = 'password'
  } = props;

  const opts = request.config({
    url: API.auth.getToken,
    method: request.METHOD.post
  });

  const data = request.formData({username, password});

  return request.xhr({
        ...opts,
        ...{ data }
      }, (error) => {
        console.log(error);
      }
  );
};
