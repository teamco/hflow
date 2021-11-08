import {fbDelete, fbReadBy} from 'services/firebase.service';

/**
 * @export
 * @param type
 * @return {{docId, data}}
 */
export const getAllSubscriptionsByType = async ({type}) => {
  const subscriptions = await  fbReadBy({
    collection: 'subscriptions',
    field: 'type',
    value: type
  });

  let data = [];

  subscriptions.forEach(doc => {
    const _data = doc.data();
    data.push(_.merge(_data, {id: doc.id}));
  });

}

/**
 * @export
 */
export const deleteSubscriptionById = async ({subscriptionId}) => {
   await fbDelete({
    collection: 'subscriptions',
    doc: subscriptionId
  });
}

