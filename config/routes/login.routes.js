/**
 * @export
 * @return [{}]
 * @constructor
 */
const LOGIN_ROUTES = (mainPath, wrappers) => {

  return [
    {
      exact: true,
      path: `${mainPath}/login`,
      breadcrumb: 'route.login',
      component: '@/pages/landing/authentication/login',
      wrappers
    },
    {
      exact: true,
      path: `${mainPath}/logout`,
      breadcrumb: 'route.login',
      component: '@/pages/landing/authentication/logout'
    },
    {
      exact: true,
      path: `${mainPath}/register`,
      breadcrumb: 'route.register',
      component: '@/pages/landing/authentication/register',
      wrappers
    },
    {
      exact: true,
      path: `${mainPath}/finishSignUp/:user`,
      breadcrumb: 'route.finishSignUp',
      component: '@/pages/landing/authentication/finishSignUp'
    },
  ];
};

module.exports = { LOGIN_ROUTES };
