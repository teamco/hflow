import request from '@/utils/request';

import { xhrRequest } from '@/services/authentication.service';

const { API } = require('@/services/config/api.config');

/**
 * @export
 * @param token
 * @param {number} size
 * @param {number} page
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const apartmentsPreview = async ({ token, size = 3, page = 0 }) => {
  return xhrRequest({
    url: API.apartments.preview,
    method: request.METHOD.get,
    params: { size, page },
    token
  });
};

/**
 * @export
 * @param token
 * @param {string} id
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const getApartment = async ({ token, id }) => {
  return xhrRequest({
    url: API.apartments.get,
    method: request.METHOD.get,
    apartmentKey: id,
    token
  });
};

/**
 * @export
 * @param token
 * @param {string} id
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const getAddress = async ({ token, id }) => {
  return xhrRequest({
    url: API.addresses.get,
    method: request.METHOD.get,
    addressKey: id,
    token
  });
};

/**
 * @export
 * @param token
 * @param {string} userByRef
 * @param {string} itemByRef
 * @param {string} [itemType]
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const apartmentView = async ({ token, userByRef, itemByRef, itemType = 'APARTMENT' }) => {
  return xhrRequest({
    url: API.views.store,
    method: request.METHOD.post,
    data: {
      userByRef,
      itemByRef,
      itemType
    },
    token
  });
};

/**
 * @export
 * @param token
 * @param {string} userByRef
 * @param {string} itemByRef
 * @param {string} [itemType]
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const apartmentLike = async ({ token, userByRef, itemByRef, itemType = 'APARTMENT' }) => {
  return xhrRequest({
    url: API.likes.store,
    method: request.METHOD.post,
    data: {
      userByRef,
      itemByRef,
      itemType
    },
    token
  });
};

/**
 * @export
 * @param props
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const apartmentUnLike = async (props) => {
  const { token, likeKey } = props;

  return xhrRequest({
    url: API.likes.delete,
    method: request.METHOD.delete,
    likeKey,
    token
  });
};

/**
 * @export
 * @param props
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const getUserApartmentLike = async (props) => {
  const { token, userByRef, itemByRef, itemType = 'APARTMENT', size = 1, page = 0 } = props;
  return xhrRequest({
    url: API.likes.store,
    method: request.METHOD.get,
    params: {
      userByRef,
      itemByRef,
      itemType,
      size,
      page
    },
    token
  });
};

/**
 * @export
 * @param props
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const getUserApartmentLikes = async (props) => {
  const { userByRef, token, size = 1, page = 0 } = props;

  return xhrRequest({
    url: API.apartments.userLikes,
    method: request.METHOD.get,
    params: {
      size,
      page
    },
    userKey: userByRef,
    token
  });
};

/**
 * @export
 * @param props
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const getUserApartmentViews = async (props) => {
  const { userByRef, token, size = 1, page = 0 } = props;

  return xhrRequest({
    url: API.apartments.userViews,
    method: request.METHOD.get,
    params: {
      size,
      page
    },
    userKey: userByRef,
    token
  });
};