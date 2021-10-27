import _ from 'lodash';
import {fbReadBy} from 'services/firebase.service';

/**
 * @export
 * @param userId
 * @return {{docId, data}}
 */
export const getNotifications = async ({userId}) => {
  let data = [];

  /**
   * @constant
   * @type {{forEach}}
   */
  const notifications = await fbReadBy({
    collection: 'notifications',
    field: 'createdBy',
    value: userId,
    optional: {order: 'createdAt'}
  });

  notifications.forEach(doc => {
    const _data = doc.data();
    data.push(_.merge(_data, {id: doc.id}));
  });

  return {data};
};
