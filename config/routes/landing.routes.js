/**
 * @export
 * @return [{}]
 * @constructor
 */
const LANDING_ROUTES = (mainPath, wrappers) => {

  return [
    {
      exact: true,
      path: `${mainPath}/`,
      breadcrumb: 'route.home',
      component: '@/pages/landing'
    },
    {
      exact: true,
      path: `${mainPath}/apartments/:apartment`,
      breadcrumb: 'route.apartments',
      component: '@/pages/landing/apartments',
      wrappers
    }
  ];
};

module.exports = { LANDING_ROUTES };
