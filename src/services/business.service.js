import _ from 'lodash';
import { fbReadAll, fbReadBy, getRef } from '@/services/firebase.service';

export const getAllBusinesses = async () => {
  const businesses = await fbReadAll({ collectionPath: 'businesses' });

  let data = [];
  businesses.forEach(doc => {
    const _data = doc.data();
    data.push(_.merge(_data, { id: doc.id }));
  });
};

/**
 * @export
 * @param userId
 * @return {{docId, data}}
 */
export const getBusinesses = async ({ userId }) => {
  let data = [];
  const userRef = await getRef({ collectionPath: 'users', document: userId });

  /**
   * @constant
   * @type {{forEach}}
   */
  const businesses = await fbReadBy({
    collectionPath: 'businesses',
    field: 'metadata.belongsToRef',
    value: userRef
  });

  businesses.forEach(doc => {
    const _data = doc.data();
    data.push(_.merge(_data, { id: doc.id }));
  });

  return { data };
};

/**
 * @export
 * @param businessRef
 * @return {Promise<*[]>}
 */
export const getBusinessByRef = async ({ businessRef }) => {

  /**
   * @constant
   * @type {{data, id}}
   */
  const business = await businessRef.get();
  const data = { ...business.data(), id: business.id };

  return [data];
};

/**
 * @export
 * @async
 * @param email
 * @return {Promise<{data: {}, docId: any}>}
 */
export const findBusinessTempUser = async ({ email }) => {
  let data = {},
      docId = undefined;

  /**
   * @constant
   * @type {{forEach}}
   */
  const users = await fbReadBy({
    collectionPath: 'tempBusinessUsers',
    field: 'email',
    value: email
  });

  users.forEach(doc => {
    data = doc.data();
    docId = doc.id;
  });

  return {
    data,
    docId
  };
};

/**
 * @export
 * @async
 * @param businessRef
 */
export const getBusinessUsers = async ({ businessRef }) => {
  let data = [];

  /**
   * @constant
   * @type {{forEach}}
   */
  const users = await fbReadBy({
    collectionPath: 'users',
    field: 'business.metadata.businessRef',
    value: businessRef
  });

  users.forEach(doc => (data.push({ ...doc.data(), userId: doc.id })));

  return data;
};

/**
 * @constant
 * @async
 * @export
 * @param businessId
 * @return {data}
 */
export const getTempBusinessUsers = async ({ businessRef }) => {
  let data = [];
  const tempBusinessUsers = await fbReadBy({
    collectionPath: 'tempBusinessUsers',
    field: 'metadata.businessRef',
    value: businessRef
  });

  tempBusinessUsers.forEach(doc => (data.push({ ...doc.data(), userId: doc.id })));

  return data;
};
