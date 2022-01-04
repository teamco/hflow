import _ from 'lodash';
import { xhrRequest } from './authentication.service';
import { API } from './config/api.config';
import request from '../utils/request';

/**
 * @export
 * @return {Promise<{data: *[]}>}
 */
export const getAllSubscriptions = async () => {
  const subscriptions = await xhrRequest({
    url: API.subscriptions.store,
    method: request.METHOD.get
  });

  let data = [];

  subscriptions?.data?.forEach(doc => {
    const _data = doc.data();
    data.push(_.merge(_data, { id: doc.id }));
  });
  return { data };
};

/**
 * @export
 * @param {string} [field]
 * @param value
 * @return {{docId, data}}
 */
export const getSubscription = async ({ id }) => {
  const subscriptions = await xhrRequest({
    url: API.subscriptions.get,
    method: request.METHOD.get,
    subscriptionsKey: id
  });

  let data = [];

  subscriptions.forEach(doc => {
    const _data = doc.data();
    data.push(_.merge(_data, { id: doc.id }));
  });
  return { data };
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



