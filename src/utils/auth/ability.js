import { Ability, AbilityBuilder } from '@casl/ability';
import { fbFindById } from 'services/firebase.service';
import { isAdmin, isContributor, isCurrent, isModerator, isReader } from 'services/userRoles.service';
import i18n from '@/utils/i18n';
import { useIntl } from 'umi';

/**
 * @export
 * @param {{roles, id, uid}} user
 * @param {{string}} [userId],
 * @param [business]
 * @return {Ability}
 */
export async function defineAbilityFor({ user, userId, business }) {
  const { can, cannot, build } = new AbilityBuilder(Ability);
  const selectedUser = userId && (await fbFindById({ collection: 'users', doc: userId })).data();
  const intl = useIntl();
  if (user) {
    if (isAdmin(user.roles)) {

      // Read-write access to everything
      can('manage', 'all');

    } else {

      can(['read'], 'businessUsers');
      can(['read'], 'roles');

      if (isCurrent(user, userId)) {

        can(['read', 'update', 'sendVerificationEmail'], 'users');
        can(['read', 'update'], 'profile');
        can(['read'], 'notifications');
        // can(['read'], 'userLogs');
        // can(['read'], 'errorLogs');
        can(['read', 'create', 'update'], 'businesses');

        // TODO (teamco): Create business user validations.
        if (business?.metadata?.createdBy === user.uid) {
          can(['manage'], 'businessUsers');
        }

      } else {

        cannot(['read', 'update'], 'users').because(intl.formatMessage({id: 'error.noPermissions', defaultMessage: 'Has no relevant permissions'}));
        cannot(['read', 'update'], 'profile').because(intl.formatMessage({id: 'error.noPermissions', defaultMessage: 'Has no relevant permissions'}));
        cannot(['read', 'update'], 'businesses').because(intl.formatMessage({id: 'error.noPermissions', defaultMessage: 'Has no relevant permissions'}));

      }
    }

    if (selectedUser?.business) {
      can(['read'], 'businesses');
      cannot(['create', 'update'], 'businesses');
      cannot(['update'], 'businessUserRole');

      const { userRoles } = selectedUser.business;

      if (isModerator(userRoles)) {
        can(['update'], 'businessUserRole');
      } else if (isContributor(userRoles)) {

      } else if (isReader(userRoles)) {

      } else {
        // Undefined role.
      }
    }

  } else {
    cannot(['read', 'update'], 'all');
  }

  can(['read'], 'home');
  can(['read'], 'login');
  can(['read'], 'page404');
  can(['read'], 'page403');
  can(['read'], 'page500');
  can(['read', 'update'], 'finishSignUp');

  return build();
}
