import { xhrRequest } from './authentication.service';
import { API } from './config/api.config';
import request from '@/utils/request';

/**
 * @export
 * @param {string} token
 * @return {Promise<{data: *[]}>}
 */
export const getAllCampaigns = async ({ token }) => {
  return await xhrRequest({
    url: API.campaigns.store,
    method: request.METHOD.get,
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
export const getCampaign = async ({ id, token }) => {
  return xhrRequest({
    url: API.campaigns.get,
    method: request.METHOD.get,
    campaignKey: id,
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
export const updateCampaign = async ({ id, data, token }) => {
  return xhrRequest({
    url: API.campaigns.get,
    method: request.METHOD.put,
    campaignKey: id,
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
export const addCampaign = async ({ data, token }) => {
  return xhrRequest({ url: API.campaigns.store, data, token });
};



