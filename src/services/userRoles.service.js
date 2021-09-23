/**
 * @export
 * @param roles
 * @return {boolean}
 */
export const isAdmin = (roles = []) => roles.indexOf('Administrator') > -1;

/**
 * @export
 * @param roles
 * @return {boolean}
 */
export const isDeveloper = (roles = []) => roles.indexOf('Developer') > -1;

/**
 * @export
 * @param user
 * @param id
 * @return {boolean}
 */
export const isCurrent = (user, id) => user?.id === id;

/**
 * @export
 * @param {string} role
 * @return {boolean}
 */
export const isOwner = (role) => role === 'Owner';

/**
 * @export
 * @param {string} role
 * @return {boolean}
 */
export const isModerator = (role) => role === 'Moderator';

/**
 * @export
 * @param {string} role
 * @return {boolean}
 */
export const isContributor = (role) => role === 'Contributor';

/**
 * @export
 * @param {string} role
 * @return {boolean}
 */
export const isReader = (role) => role === 'Reader';
