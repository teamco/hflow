import _ from 'lodash';
import { xhrRequest } from './authentication.service';
import { API } from './config/api.config';
import request from '../utils/request';

/**
 * @export
 * @return {Promise<{data: *[]}>}
 */
export const getAllCampaigns = async () => {
  return await xhrRequest({
    url: API.campaigns.store,
    method: request.METHOD.get
  });
};

/**
* @async
* @export
* @param data
* @return {Promise<GlobalConfig.Promise<*>|undefined>}
*/
export const getCampaign = async ({ id }) => {
  return xhrRequest({
    url: API.campaigns.get,
    method: request.METHOD.get,
    campaignKey: id
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
  return xhrRequest({
    url: API.campaigns.get,
    method: request.METHOD.put,
    campaignKey: id,
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
  return xhrRequest({ url: API.campaigns.store, data });
};



