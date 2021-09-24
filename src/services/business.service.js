import _ from 'lodash';
import { fbReadAll, fbReadBy, getRef } from 'services/firebase.service';

export const getAllBusinesses = async () => {
  const businesses = await fbReadAll({ collection: 'businesses' });

  let data = [];
  businesses.forEach(doc => {
    const _data = doc.data();
    data.push(_.merge(_data, { id: doc.id }));
  });

  debugger
}

/**
 * @export
 * @param userId
 * @return {{docId, data}}
 */
export const getBusinesses = async ({ userId }) => {
  let data = [];
  const userRef = await getRef({ collection: 'users', doc: userId });

  /**
   * @constant
   * @type {{forEach}}
   */
  const businesses = await fbReadBy({
    collection: 'businesses',
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
    collection: 'tempBusinessUsers',
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
    collection: 'users',
    field: 'business.metadata.businessRef',
    value: businessRef
  });

  users.forEach(doc => (data.push(doc.data())));
  return data;
};
