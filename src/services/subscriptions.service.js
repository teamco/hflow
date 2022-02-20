import { API } from '@/services/config/api.config';
import request from '@/utils/request';
import { xhrRequest } from '@/services/authentication.service';

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
    subscriptionsKey: id,
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



