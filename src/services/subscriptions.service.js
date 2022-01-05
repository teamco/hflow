import { API } from '@/services/config/api.config';
import request from '@/utils/request';
import { xhrRequest } from '@/services/authentication.service';

/**
 * @export
 * @return {Promise<{data: *[]}>}
 */
export const getAllSubscriptions = async () => {
  return xhrRequest({
    url: API.subscriptions.store,
    method: request.METHOD.get
  });
};

/**
 * @export
 * @param id
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const getSubscription = async ({id}) => {
  return xhrRequest({
    url: API.subscriptions.get,
    method: request.METHOD.get,
    subscriptionsKey: id
  });
};

/**
 * @async
 * @export
 * @param {string} id
 * @param data
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const updateSubscription = async ({ id, data }) => {
  return xhrRequest({
    url: API.subscriptions.get,
    method: request.METHOD.put,
    subscriptionKey: id,
    data
  });
};

/**
 * @async
 * @export
 * @param data
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const addSubscription = async ({ data }) => {
  return xhrRequest({ url: API.subscriptions.store, data });
};



