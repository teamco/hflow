import _ from 'lodash';
import { fbDelete, fbReadAll, fbReadBy } from 'services/firebase.service';

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

