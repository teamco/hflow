import {getUsers} from 'services/user.service';
import {tsToLocaleDateTime} from 'utils/timestamp';

/**
 * @export
 * @async
 * @param entity
 * @param user
 * @return {Promise<*>}
 */
export async function detailsInfo({entity, user}) {

  /**
   * @constant
   * @type {{data}}
   */
  const users = await getUsers({user});

  const _metadata = {...entity.metadata};
  const updatedBy = (await _metadata.updatedByRef.get()).data();
  const createdBy = (await _metadata.createdByRef.get()).data();

  _metadata.updatedBy = users.data.find(user => user.uid === updatedBy.uid);
  _metadata.createdBy = users.data.find(user => user.uid === createdBy.uid);
  _metadata.createdAt = tsToLocaleDateTime(_metadata.createdAt);
  _metadata.updatedAt = tsToLocaleDateTime(_metadata.updatedAt);

  return _metadata;
}
