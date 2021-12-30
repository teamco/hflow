import _ from 'lodash';
import { xhrRequest } from './authentication.service';
import { API } from './config/api.config';
import request from '../utils/request';

/**
 * @export
 * @return {Promise<{data: *[]}>}
 */
export const getAllCampaigns = async () => {
  const campaigns = await xhrRequest({
    url: API.campaigns.store,
    method: request.METHOD.get
  });

  let data = [];

  campaigns?.data?.forEach(doc => {
    const _data = doc.data();
    data.push(_.merge(_data, {id: doc.id}));
  });
  return {data};
};

/**
* @async
* @export
* @param data
* @return {Promise<GlobalConfig.Promise<*>|undefined>}
*/
export const getCampaign = async ({ id }) => {
  return await xhrRequest({
    url: API.campaigns.get,
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
export const updateCampaign = async ({ id, data }) => {
  return await xhrRequest({
    url: API.campaigns.get,
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
export const addCampaign = async ({ data }) => {
  return await xhrRequest({ url: API.campaigns.store, data });
};



