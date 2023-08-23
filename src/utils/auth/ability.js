import { createMongoAbility, AbilityBuilder } from '@casl/ability';

import { fbFindById } from '@/services/firebase.service';

/**
 * @async
 * @export
 * @param props
 * @return {Promise<MongoAbility<A, C>>}
 */
export async function defineAbilityFor(props) {
  const { user, userId, business, rolesFor = {} } = props;
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  const selectedUser = userId && (await fbFindById({ collectionPath: 'users', docName: userId }))?.data();

  if (!selectedUser) {
    console.info('Guest');
  }

  if (user?.roles) {
    const { roles } = user;

    for (let role of roles) {
      if (rolesFor[role]) {
        for (let permission of rolesFor[role]) {
          const abilityRoles = permission?.abilities?.map(a => a.role.title);
          const componentRoles = permission?.components?.map(a => a.role.title);

          for (let component of componentRoles) {
            can([...abilityRoles], component);

            DEBUG && console.info(`Generated [${abilityRoles.join(', ')}] roles for ${component}`);
          }
        }
      }
    }
  }

  can(['register'], 'landing.register');
  can(['login'], 'landing.login');
  can(['read', 'logout'], 'landing.logout');
  can(['read'], 'page404');
  can(['read'], 'page403');
  can(['read'], 'page500');

  // can(['read'], 'home');
  // can(['read', 'update'], 'finish.signup');

  return build();
}
