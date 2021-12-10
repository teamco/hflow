import _ from 'lodash';
import { fbDelete, fbReadAll, fbReadBy } from 'services/firebase.service';

/**
 * @export
 * @return {Promise<{data: *[]}>}
 */
export const getAllCampaigns = async () => {
  const subscriptions = await fbReadAll({ collection: 'Campaigns' });

  let data = [];

  subscriptions.forEach(doc => {
    const _data = doc.data();
    data.push(_.merge(_data, {id: doc.id}));
  });
  return {data};
};

/**
 * @export
 * @param {string} [field]
 * @param value
 * @return {{docId, data}}
 */
export const getAllCampaignsBy = async ({ field = 'campaignType', value }) => {
  const subscriptions = await fbReadBy({
    collection: 'campaigns',
    field,
    value
  });

  let data = [];

  subscriptions.forEach(doc => {
    const _data = doc.data();
    data.push(_.merge(_data, {id: doc.id}));
  });
  return {data};
};

/**
 * @export
 * @param doc
 * @return {Promise<void>}
 */
export const deleteCampaign = async ({ doc }) => {
  await fbDelete({ collection: 'campaigns', doc });
};

