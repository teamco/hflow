import request from 'utils/request';
import { xhrRequest } from 'services/authentication.service';
import { API } from 'services/config/api.config';

/**
 * @async
 * @export
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const getFeatures = async ({ type }) => {
  return await xhrRequest({
    url: API.features.store,
    method: request.METHOD.get,
    type
  });
};

/**
 * @async
 * @export
 * @param data
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const getFeature = async ({ id }) => {
  return await xhrRequest({
    url: API.features.get,
    method: request.METHOD.get,
    featureKey: id
  });
};

/**
 * @async
 * @export
 * @param {string} id
 * @param data
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const updateFeature = async ({ id, data }) => {
  return await xhrRequest({
    url: API.features.get,
    method: request.METHOD.put,
    featureKey: id,
    data
  });
};

/**
 * @async
 * @export
 * @param data
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const addFeature = async ({ data }) => {
  return await xhrRequest({ url: API.features.store, data });
};
