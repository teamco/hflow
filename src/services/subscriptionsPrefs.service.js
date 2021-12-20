import _ from 'lodash';

import request from 'utils/request';

import { fbDelete, fbReadAll, fbReadBy } from 'services/firebase.service';
import { xhrRequest } from 'services/authentication.service';
import { API } from 'services/config/api.config';

/**
 * @export
 * @return {Promise<{data: *[]}>}
 */
export const getAllPreferences = async () => {
  const preferences = await fbReadAll({ collection: 'subscriptionPrefs' });

  let data = [];

  preferences.forEach(doc => {
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
export const getAllSubscriptionsBy = async ({ field = 'subscriptionType', value }) => {
  const subscriptions = await fbReadBy({
    collection: 'subscriptions',
    field,
    value
  });

  let data = [];

  subscriptions.forEach(doc => {
    const _data = doc.data();
    data.push(_.merge(_data, { id: doc.id }));
  });
  return { data };
};

/**
 * @export
 * @param doc
 * @return {Promise<void>}
 */
export const deleteSubscription = async ({ doc }) => {
  await fbDelete({ collection: 'subscriptions', doc });
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
 * @param data
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const addFeature = async ({ data }) => {
  return await xhrRequest({ url: API.features.save, data });
};
