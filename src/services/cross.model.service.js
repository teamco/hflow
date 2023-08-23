import { getUsers } from '@/services/user.service';
import { getRef, fbFindById } from '@/services/firebase.service';

import { tsToLocaleDateTime } from '@/utils/timestamp';

/**
 * @constant
 * @param byRef
 * @return {Promise<*>}
 * @private
 */
const _getUserRef = async (byRef) => {
  let _byRef = byRef;
  if (typeof byRef === 'string') {
    // Handle server stored Id.
    _byRef = await fbFindById({ collectionPath: 'users', docName: byRef });
  }

  return _byRef;
};

/**
 * @export
 * @async
 * @param props
 * @return {Promise<*>}
 */
export async function detailsInfo(props = {}) {
  const { entity, user } = props;

  const users = await getUsers({ user });

  const _metadata = { ...entity?.metadata };
  const { updatedByRef, createdByRef } = _metadata;

  const updatedBy = await _getUserRef(updatedByRef);

  // Reduce round trip to firebase.
  const createdBy = createdByRef === updatedByRef ?
      updatedBy : await _getUserRef(createdByRef);

  _metadata.updatedBy = users?.data?.find(user => user.id === updatedBy?.id);
  _metadata.createdBy = users?.data?.find(user => user.id === createdBy?.id);
  _metadata.createdAt = tsToLocaleDateTime(_metadata?.createdAt);
  _metadata.updatedAt = tsToLocaleDateTime(_metadata?.updatedAt);

  return _metadata;
}

