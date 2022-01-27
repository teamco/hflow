import _ from 'lodash';
import { fbFindById, fbReadBy, getRef } from 'services/firebase.service';

/**
 * @export
 * @param userId
 * @param email
 * @return {{docId, data}}
 */
export const getNotifications = async ({ userId, email }) => {
  let inbox = [];
  let sent = [];

  const userRef = getRef({
    collection: 'users',
    doc: userId
  });

  /**
   * @constant
   * @type {{forEach}}
   */
  const createdBy = await fbReadBy({
    collection: 'notifications',
    field: 'metadata.createdByRef',
    value: userRef,
    optional: { order: 'metadata.createdAt' }
  });

  /**
   * @constant
   * @type {{forEach}}
   */
  const sentTo = await fbReadBy({
    collection: 'notifications',
    field: 'sentTo',
    value: email,
    optional: { order: 'metadata.createdAt' }
  });

  createdBy?.forEach(doc => {
    const _data = doc.data();
    sent.push(_.merge(_data, { id: doc.id }));
  });

  sentTo?.forEach(doc => {
    const _data = doc.data();
    inbox.push(_.merge(_data, { id: doc.id }));
  });

  let _users = {};

  for (let msg of inbox) {
    const sentFrom = msg.metadata.createdByRef;
    const userId = (await sentFrom.get()).data().id;

    if (_users[userId]) {
      msg.sentFrom = _users[userId];
    } else {
      const _user = await fbFindById({
        collection: 'users',
        doc: userId
      });

      if (_user.exists) {
        msg.sentFrom = _user.data();
        _users[userId] = { ...msg.sentFrom };
      }

      if (msg.replyRef) {
        msg.replyedTo = (await msg.replyRef.get()).data();
      }
    }
  }

  return { sent, inbox };
};
