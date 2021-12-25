import { getUsers } from 'services/user.service';
import { getRef } from 'services/firebase.service';

import { tsToLocaleDateTime } from 'utils/timestamp';

/**
 * @constant
 * @param byRef
 * @return {Promise<*>}
 * @private
 */
const _getUserRef = async (byRef) => {
  if (typeof byRef === 'string') {
    // Handle server stored Id.
    byRef = getRef({ collection: 'users', doc: byRef });
  }

  return (await byRef?.get())?.data();
};

/**
 * @export
 * @async
 * @param props
 * @return {Promise<*>}
 */
export async function detailsInfo(props = {}) {
  const { entity, user } = props;

  /**
   * @constant
   * @type {{data}}
   */
  const users = await getUsers({ user });

  const _metadata = { ...entity?.metadata };
  const { updatedByRef, createdByRef } = _metadata;

  const updatedBy = await _getUserRef(updatedByRef);

  // Reduce round trip to firebase.
  const createdBy = createdByRef?.id === updatedByRef?.id ?
      updatedBy : await _getUserRef(createdByRef);

  _metadata.updatedBy = users?.data?.find(user => user.uid === updatedBy?.uid);
  _metadata.createdBy = users?.data?.find(user => user.uid === createdBy?.uid);
  _metadata.createdAt = tsToLocaleDateTime(_metadata?.createdAt);
  _metadata.updatedAt = tsToLocaleDateTime(_metadata?.updatedAt);

  return _metadata;
}

