import { xhrRequest } from '@/services/authentication.service';
import request from '@/utils/request';

const { API } = require('@/services/config/api.config');

/**
 * @async
 * @export
 * @param {string} userKey
 * @param {string} subscriptionKey
 * @param {string} token
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const updateUserSubscription = async ({ userKey, subscriptionKey, token }) => {
  return xhrRequest({
    url: API.users.subscription,
    method: request.METHOD.put,
    userKey,
    subscriptionKey,
    token
  });
};

/**
 * @export
 * @param {string} userKey
 * @param token
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const getServerUser = async ({ userKey, token }) => {
  return xhrRequest({
    url: API.users.get,
    method: request.METHOD.get,
    userKey,
    token
  });
};

/**
 * @export
 * @param {string} userKey
 * @param {string} profileKey
 * @param token
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const getServerProfile = async ({ userKey, profileKey, token }) => {
  return xhrRequest({
    url: API.profile.get,
    method: request.METHOD.get,
    userKey,
    profileKey,
    token
  });
};


/**
 * @export
 * @param {string} userKey
 * @param {string} profileKey
 * @param token
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const getProfileLogos = async ({ userKey, profileKey, token }) => {
  return xhrRequest({
    url: API.profile.logos,
    method: request.METHOD.get,
    userKey,
    profileKey,
    token
  });
};

/**
 * @export
 * @param {string} userKey
 * @param {string} profileKey
 * @param data
 * @param token
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const storeProfileLogos = async ({ userKey, profileKey, data, token }) => {
  return xhrRequest({
    url: API.profile.logos,
    method: request.METHOD.post,
    userKey,
    profileKey,
    data,
    token
  });
};

/**
 * @export
 * @param {string} userKey
 * @param {string} profileKey
 * @param token
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const getProfileLinks = async ({ userKey, profileKey, token }) => {
  return xhrRequest({
    url: API.profile.links,
    method: request.METHOD.get,
    userKey,
    profileKey,
    token
  });
};

/**
 * @export
 * @param {string} userKey
 * @param {string} profileKey
 * @param data
 * @param token
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const storeProfileLinks = async ({ userKey, profileKey, data, token }) => {
  return xhrRequest({
    url: API.profile.links,
    method: request.METHOD.post,
    userKey,
    profileKey,
    data,
    token
  });
};

/**
 * @export
 * @param {string} userKey
 * @param {string} profileKey
 * @param token
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const getProfileAddresses = async ({ userKey, profileKey, token }) => {
  return xhrRequest({
    url: API.profile.addresses,
    method: request.METHOD.get,
    userKey,
    profileKey,
    token
  });
};

/**
 * @export
 * @param {string} userKey
 * @param {string} profileKey
 * @param data
 * @param token
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const storeProfileAddresses = async ({ userKey, profileKey, data, token }) => {
  return xhrRequest({
    url: API.profile.addresses,
    method: request.METHOD.post,
    userKey,
    profileKey,
    data,
    token
  });
};

/**
 * @export
 * @param {string} userKey
 * @param {string} profileKey
 * @param token
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const getProfileEmails = async ({ userKey, profileKey, token }) => {
  return xhrRequest({
    url: API.profile.emails,
    method: request.METHOD.get,
    userKey,
    profileKey,
    token
  });
};

/**
 * @export
 * @param {string} userKey
 * @param {string} profileKey
 * @param data
 * @param token
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const storeProfileEmails = async ({ userKey, profileKey, data, token }) => {
  return xhrRequest({
    url: API.profile.emails,
    method: request.METHOD.post,
    userKey,
    profileKey,
    data,
    token
  });
};

/**
 * @export
 * @param {string} userKey
 * @param data
 * @param token
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const saveProfile = async ({ userKey, data, token }) => {
  return xhrRequest({
    url: API.profile.store,
    method: request.METHOD.post,
    userKey,
    data,
    token
  });
};


/**
 * @export
 * @param {string} userKey
 * @param {string} profileKey
 * @param data
 * @param token
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const updateProfile = async ({ userKey, profileKey, data,  token }) => {
  return xhrRequest({
    url: API.profile.get,
    method: request.METHOD.put,
    userKey,
    profileKey,
    data,
    token
  });
};

/**
 * @export
 * @param token
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const getProfileConnections = async ({ userKey, profileKey, data,  token, size = 3, page = 0  }) => {
  return xhrRequest({
    url: API.profile.list,
    method: request.METHOD.get,
    params: {
      size,
      page
    },
    token
  });
};

/**
* @export
* @param token
* @return {Promise<GlobalConfig.Promise<*>|undefined>}
*/
export const getOpenProfile = async ({ profileKey,  token}) => {
  return xhrRequest({
    url: API.profile.overview,
    method: request.METHOD.get,
    profileKey,
    token
  });
};



