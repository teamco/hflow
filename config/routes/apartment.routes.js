/**
 * @export
 * @return [{}]
 * @constructor
 */
const APARTMENT_ROUTES = (mainPath, wrappers) => {

  return [
    {
      exact: true,
      path: `${mainPath}/profile/apartments`,
      breadcrumb: 'route.profile.apartments',
      component: '@/pages/landing/profile/apartments',
      wrappers
    },
    {
      exact: true,
      path: `${mainPath}/profile/:profile/apartments`,
      breadcrumb: 'route.profile.apartments',
      component: '@/pages/landing/profile/apartments',
      wrappers
    },
    {
      exact: true,
      path: `${mainPath}/profile/apartments/:apartment`,
      component: '@/pages/landing/profile/apartments/[apartment]',
      breadcrumb: 'route.profile.apartments',
      wrappers
    },
    {
      exact: true,
      path: `${mainPath}/profile/:profile/apartments/:apartment`,
      component: '@/pages/landing/profile/apartments/[apartment]',
      breadcrumb: 'route.profile.apartments',
      wrappers
    }
  ];
};

module.exports = { APARTMENT_ROUTES };
