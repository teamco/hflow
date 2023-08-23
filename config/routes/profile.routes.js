/**
 * @export
 * @return [{}]
 * @constructor
 */
const PROFILE_ROUTES = (mainPath, wrappers) => {

  return [
    {
      path: `${mainPath}/profile/`,
      redirect: `${mainPath}/profile/account`
    },
    {
      exact: true,
      path: `${mainPath}/profile/account`,
      breadcrumb: 'route.profile.account',
      component: '@/pages/landing/profile/account',
      wrappers
    },
    {
      exact: true,
      path: `${mainPath}/profile/emails`,
      breadcrumb: 'route.profile.emails',
      component: '@/pages/landing/profile/emails',
      wrappers
    },
    {
      exact: true,
      path: `${mainPath}/profile/links`,
      breadcrumb: 'route.profile.links',
      component: '@/pages/landing/profile/links',
      wrappers
    },
    {
      exact: true,
      path: `${mainPath}/profile/logos`,
      breadcrumb: 'route.profile.logos',
      component: '@/pages/landing/profile/logos',
      wrappers
    },
    {
      exact: true,
      path: `${mainPath}/profile/addresses`,
      breadcrumb: 'route.profile.addresses',
      component: '@/pages/landing/profile/addresses',
      wrappers
    },
    {
      exact: true,
      path: `${mainPath}/profile/public`,
      breadcrumb: 'route.profile.public',
      component: '@/pages/landing/profile/public',
      wrappers
    },
    {
      exact: true,
      path: `${mainPath}/profile/notifications`,
      breadcrumb: 'route.profile.notifications',
      component: '@/pages/notifications',
      wrappers
    },
    {
      exact: true,
      path: `${mainPath}/profile/history`,
      breadcrumb: 'route.profile.history',
      component: '@/pages/landing/profile/history',
      wrappers
    },
    {
      exact: true,
      path: `${mainPath}/profile/history/liked`,
      breadcrumb: 'route.profile.history.liked',
      component: '@/pages/landing/profile/history/sections/liked/history.liked.connect',
      wrappers
    },
    {
      exact: true,
      path: `${mainPath}/profile/history/viewed`,
      breadcrumb: 'route.profile.history.viewed',
      component: '@/pages/landing/profile/history/sections/viewed/history.viewed.connect',
      wrappers
    },
    {
      exact: true,
      path: `${mainPath}/profile/subscriptions`,
      breadcrumb: 'route.profile.subscriptions',
      component: '@/pages/landing/profile/subscriptions',
      wrappers
    },
    {
      exact: true,
      path: `${mainPath}/profile/subscriptions/overview`,
      breadcrumb: 'route.profile.subscriptions.all',
      component: '@/pages/landing/profile/subscriptions/overview',
      wrappers
    },
    {
      exact: true,
      path: `${mainPath}/profile/features/:feature`,
      breadcrumb: 'route.profile.feature',
      component: '@/pages/landing/profile/features/feature',
      wrappers
    },
    {
      exact: true,
      path: `${mainPath}/profile/overview/:profileId`,
      breadcrumb: 'route.profile.overview',
      component: '@/pages/landing/profile/overview',
      wrappers
    },
    {
      exact: true,
      path: `${mainPath}/profile/network`,
      breadcrumb: 'route.profile.network',
      component: '@/pages/landing/profile/network',
      wrappers
    },
    {
      exact: true,
      path: `${mainPath}/profile/feed`,
      breadcrumb: 'route.profile.feed',
      component: '@/pages/landing/profile/feed',
      wrappers
    }
  ];
};

module.exports = { PROFILE_ROUTES };
