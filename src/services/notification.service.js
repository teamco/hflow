import _ from 'lodash';
import {fbFindById, fbReadBy} from 'services/firebase.service';

/**
 * @export
 * @param userId
 * @param email
 * @return {{docId, data}}
 */
export const getNotifications = async ({userId, email}) => {
  let inbox = [];
  let sent = [];

  /**
   * @constant
   * @type {{forEach}}
   */
  const createdBy = await fbReadBy({
    collection: 'notifications',
    field: 'metadata.createdBy',
    value: userId,
    optional: {order: 'metadata.createdAt'}
  });

  /**
   * @constant
   * @type {{forEach}}
   */
  const sentTo = await fbReadBy({
    collection: 'notifications',
    field: 'sentTo',
    value: email,
    optional: {order: 'metadata.createdAt'}
  });

  createdBy.forEach(doc => {
    const _data = doc.data();
    sent.push(_.merge(_data, {id: doc.id}));
  });

  sentTo.forEach(doc => {
    const _data = doc.data();
    inbox.push(_.merge(_data, {id: doc.id}));
  });

  let _users = {};

  for (let msg of inbox) {
    const userId = msg.metadata.createdBy;
    if (_users[userId]) {
      msg.sentFrom = _users[userId];
    } else {
      const _user = await fbFindById({
        collection: 'users',
        doc: userId
      });

      if (_user.exists) {
        msg.sentFrom = _user.data();
        _users[userId] = {...msg.sentFrom};
      }
    }
  }

  return {sent, inbox};
};