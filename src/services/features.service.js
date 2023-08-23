import request from '@/utils/request';
import { xhrRequest } from '@/services/authentication.service';

const { API } = require('@/services/config/api.config');

/**
 * @async
 * @export
 * @param {string} type
 * @param {*} token
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const getFeatures = async ({ type, token }) => {
  return xhrRequest({
    url: API.features.store,
    method: request.METHOD.get,
    params: { type },
    token
  });
};

/**
 * @async
 * @export
 * @param {string} id
 * @param {string} token
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const getFeature = async ({ id, token }) => {
  return xhrRequest({
    url: API.features.get,
    method: request.METHOD.get,
    featureKey: id,
    token
  });
};

/**
 * @async
 * @export
 * @param {string} id
 * @param {string} token
 * @param data
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const updateFeature = async ({ id, data, token }) => {
  return xhrRequest({
    url: API.features.get,
    method: request.METHOD.put,
    featureKey: id,
    data,
    token
  });
};

/**
 * @async
 * @export
 * @param data
 * @param {string} token
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const addFeature = async ({ data, token }) => {
  return xhrRequest({ url: API.features.store, data, token });
};

/**
 * @async
 * @export
 * @param {string} id
 * @param {string} token
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const deleteFeature = async ({ id, token }) => {
  return xhrRequest({ url: API.features.delete, method: request.METHOD.delete, featureKey: id, token });
};

