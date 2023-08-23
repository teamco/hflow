const { ERRORS } = require('./error.routes');
const { ADMIN_ROUTES } = require('./admin.routes');
const { LOGIN_ROUTES } = require('./login.routes');
const { PROFILE_ROUTES } = require('./profile.routes');
const { APARTMENT_ROUTES } = require('./apartment.routes');
const { LANDING_ROUTES } = require('./landing.routes');

const wrappers = ['@/wrappers/auth.consumer'];

const MAIN_ROUTES = (mainPath = '') => {
  const mainErrors = ERRORS(mainPath);
  const loginRoutes = LOGIN_ROUTES(mainPath, wrappers);
  const profileRoutes = PROFILE_ROUTES(mainPath, wrappers);
  const landingRoutes = LANDING_ROUTES(mainPath, wrappers);
  const apartmentRoutes = APARTMENT_ROUTES(mainPath, wrappers);
  const adminRoutes = ADMIN_ROUTES();

  return {
    exact: false,
    path: `${mainPath}/`,
    component: '@/layouts/landing',
    routes: [
      ...landingRoutes,
      {
        exact: true,
        path: `${mainPath}/profile`,
        breadcrumb: 'route.profile',
        component: '@/layouts/profile',
        wrappers,
        routes: [
          ...profileRoutes,
          ...apartmentRoutes
        ]
      },
      adminRoutes,
      ...loginRoutes,
      ...mainErrors
    ]
  };
};

module.exports = { MAIN_ROUTES };