import request from '@/utils/request';
import { xhrRequest } from '@/services/authentication.service';

const { API } = require('@/services/config/api.config');

/**
 * @export
 * @param {string} token
 * @return {Promise<{data: *[]}>}
 */
export const getAllSubscriptions = async ({ token }) => {
  return xhrRequest({
    url: API.subscriptions.store,
    method: request.METHOD.get,
    token
  });
};

/**
 * @export
 * @param id
 * @param {string} token
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const getSubscription = async ({ id, token }) => {
  return xhrRequest({
    url: API.subscriptions.get,
    method: request.METHOD.get,
    subscriptionKey: id,
    token
  });
};

/**
 * @async
 * @export
 * @param {string} id
 * @param data
 * @param {string} token
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const updateSubscription = async ({ id, data, token }) => {
  return xhrRequest({
    url: API.subscriptions.get,
    method: request.METHOD.put,
    subscriptionKey: id,
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
export const addSubscription = async ({ data, token }) => {
  return xhrRequest({ url: API.subscriptions.store, data, token });
};

/**
 * @async
 * @export
 * @param {string} id
 * @param {string} token
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const deleteSubscription = async ({ id, token }) => {
  return xhrRequest({
    url: API.subscriptions.delete,
    method: request.METHOD.delete,
    subscriptionKey: id,
    token
  });
};



