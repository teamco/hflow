import { t } from '@/utils/i18n';

import styles from '@/components/Landing/landing.module.less';

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
 * @param roles
 * @return {boolean}
 */
export const isTest = (roles = []) => roles.indexOf('Test') > -1;

/**
 * @export
 * @param {string} role
 * @return {boolean}
 */
export const isBusiness = (role) => {
  return isOwner(role) ||
      isModerator(role) ||
      isContributor(role) ||
      isReader(role);
};

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

/**
 * @export
 * @param props
 */
export const handleRefresh = (props) => {
  const {
    api,
    intl,
    className,
    refreshPageIn
  } = props;

  let minutes = Math.ceil(refreshPageIn / 60);
  let seconds = Math.ceil(refreshPageIn % 60);

  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  api.warning({
    className,
    duration: refreshPageIn,
    message: t(intl, 'msg.changedRoles.title'),
    description: t(intl, 'msg.pageRefresh', { sec: minutes + ':' + seconds })
  });

  setTimeout(() => {
    window.location.reload();
  }, refreshPageIn * 1000);
};
