import _ from 'lodash';
import { fbReadBy, getRef } from '@/services/firebase.service';

/**
 * @export
 * @param {string} userId
 * @param {string} email
 * @param {string} [type]
 * @return {{docId, data}}
 */
export const getNotifications = async ({ userId, email, type = 'inbox' }) => {
  let inbox = [];
  let sent = [];

  if (type === 'inbox') {

    /**
     * @constant
     * @type {{forEach}}
     */
    const sentTo = await fbReadBy({
      collectionPath: 'notifications',
      field: 'sentTo',
      value: email,
      optional: { order: 'metadata.createdAt' }
    });

    sentTo?.forEach(doc => {
      const _data = doc.data();
      inbox.push(_.merge(_data, { id: doc.id }));
    });
  }

  if (type === 'sent') {
    const userRef = getRef({
      collectionPath: 'users',
      document: userId
    });

    /**
     * @constant
     * @type {{forEach}}
     */
    const createdBy = await fbReadBy({
      collectionPath: 'notifications',
      field: 'metadata.createdByRef',
      value: userRef,
      optional: { order: 'metadata.createdAt' }
    });

    createdBy?.forEach(doc => {
      const _data = doc.data();
      sent.push(_.merge(_data, { id: doc.id }));
    });
  }

  return { sent, inbox };
};
