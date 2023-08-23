const { ERRORS } = require('./error.routes');

const wrappers = ['@/wrappers/auth.admin'];

/**
 * @export
 * @param {string} [adminPath]
 * @return {{path: string, routes: [{path: string, component: string, breadcrumb: string, wrappers: string[], exact: boolean},{path: string, component: string, breadcrumb: string, wrappers: string[], exact: boolean},{path: string, component: string, breadcrumb: string, wrappers: string[], exact: boolean},{path: string, component: string, breadcrumb: string, wrappers: string[], exact: boolean},{path: string, component: string, breadcrumb: string, wrappers: string[], exact: boolean},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null], component: string, breadcrumb: string, exact: boolean}}
 * @constructor
 */
const ADMIN_ROUTES = (adminPath = '/admin') => {
  const adminErrors = ERRORS(adminPath, '');

  return {
    exact: false,
    path: adminPath,
    component: '@/layouts/app',
    breadcrumb: 'route.admin',
    routes: [
      {
        exact: true,
        path: adminPath,
        breadcrumb: 'route.home',
        component: '@/pages/home',
        wrappers
      },
      {
        exact: true,
        path: `${adminPath}/users`,
        component: '@/pages/users',
        breadcrumb: 'route.users',
        wrappers
      },
      {
        exact: true,
        path: `${adminPath}/profile`,
        component: '@/pages/users/[user]/profile',
        breadcrumb: 'route.userProfile',
        wrappers
      },
      {
        exact: true,
        path: `${adminPath}/users/:user`,
        component: '@/pages/users/[user]/profile',
        breadcrumb: 'route.userProfile',
        wrappers
      },
      {
        exact: true,
        path: `${adminPath}/users/:user/notifications`,
        component: '@/pages/notifications',
        breadcrumb: 'route.notifications',
        wrappers
      },
      {
        exact: true,
        path: `${adminPath}/businesses`,
        component: '@/pages/users/[user]/businesses',
        breadcrumb: 'route.businesses',
        wrappers
      },
      {
        exact: true,
        path: `${adminPath}/users/:user/businesses`,
        component: '@/pages/users/[user]/businesses',
        breadcrumb: 'route.businesses',
        wrappers
      },
      {
        exact: true,
        path: `${adminPath}/businesses/:business`,
        component: '@/pages/users/[user]/businesses/[business]',
        breadcrumb: 'route.businessEdit',
        wrappers
      },
      {
        exact: true,
        path: `${adminPath}/businesses/:business`,
        component: '@/pages/users/[user]/businesses/[business]/show',
        breadcrumb: 'route.businessShow',
        wrappers
      },
      // {
      //   exact: true,
      //   path: `${adminPath}/users/:user/businesses/:business/edit`,
      //   component: '@/pages/users/[user]/businesses/[business]',
      //   breadcrumb: 'route.businessEdit',
      //   wrappers
      // },
      {
        exact: true,
        path: `${adminPath}/users/:user/businesses/:business`,
        component: '@/pages/users/[user]/businesses/[business]',
        breadcrumb: 'route.businessShow',
        wrappers
      },
      // {
      //   exact: true,
      //   path: `${adminPath}/users/:user/businesses/:business/`,
      //   component: '@/pages/users/[user]/businesses/[business]/show',
      //   breadcrumb: 'route.businessShow',
      //   wrappers
      // },
      {
        exact: true,
        path: `${adminPath}/users/:user/businesses/:business/users`,
        component: '@/pages/users/[user]/businesses/[business]/users',
        breadcrumb: 'route.businessUsers',
        wrappers
      },
      {
        exact: true,
        path: `${adminPath}/roles/user`,
        component: '@/pages/roles/userRoles',
        breadcrumb: 'route.userRoles',
        wrappers
      },
      {
        exact: true,
        path: `${adminPath}/roles/business`,
        component: '@/pages/roles/businessRoles',
        breadcrumb: 'route.businessRoles',
        wrappers
      },
      {
        exact: true,
        path: `${adminPath}/roles/component`,
        component: '@/pages/roles/componentRoles',
        breadcrumb: 'route.componentRoles',
        wrappers
      },
      {
        exact: true,
        path: `${adminPath}/roles/ability`,
        component: '@/pages/roles/abilityRoles',
        breadcrumb: 'route.abilityRoles',
        wrappers
      },
      {
        exact: true,
        path: `${adminPath}/roles/manager`,
        component: '@/pages/roles/rolesManager',
        breadcrumb: 'route.rolesManager',
        wrappers
      },
      {
        exact: true,
        path: `${adminPath}/businessTypes`,
        component: '@/pages/business/types',
        breadcrumb: 'route.businessTypes',
        wrappers
      },
      {
        exact: true,
        path: `${adminPath}/campaigns`,
        component: '@/pages/campaigns',
        breadcrumb: 'route.campaigns',
        wrappers
      },
      {
        exact: true,
        path: `${adminPath}/campaigns/:campaign`,
        component: '@/pages/campaigns/[campaign]',
        breadcrumb: 'route.campaign',
        wrappers
      },
      {
        exact: true,
        path: `${adminPath}/properties`,
        component: '@/pages/properties',
        breadcrumb: 'route.properties',
        wrappers
      },
      {
        exact: true,
        path: `${adminPath}/properties/:property`,
        component: '@/pages/properties/[property]',
        breadcrumb: 'route.property',
        wrappers
      },
      {
        exact: true,
        path: `${adminPath}/subscriptions`,
        component: '@/pages/subscriptions',
        breadcrumb: 'route.subscriptions',
        wrappers
      },
      {
        exact: true,
        path: `${adminPath}/subscriptions/:subscription`,
        component: '@/pages/subscriptions/[subscription]',
        breadcrumb: 'route.subscription',
        wrappers
      },
      {
        exact: true,
        path: `${adminPath}/schedulers`,
        component: '@/pages/schedulers',
        breadcrumb: 'route.schedulers',
        wrappers
      },
      {
        exact: true,
        path: `${adminPath}/subscriptionTypes`,
        component: '@/pages/subscriptions/types',
        breadcrumb: 'route.subscriptionTypes',
        wrappers
      },
      {
        exact: true,
        path: `${adminPath}/currencies`,
        component: '@/pages/currencies',
        breadcrumb: 'route.currencies',
        wrappers
      },
      {
        exact: true,
        path: `${adminPath}/durationTypes`,
        component: '@/pages/durationTypes',
        breadcrumb: 'route.durationTypes',
        wrappers
      },
      {
        exact: true,
        path: `${adminPath}/featureTypes`,
        component: '@/pages/subscriptions/features/types',
        breadcrumb: 'route.featureTypes',
        wrappers
      },
      {
        exact: true,
        path: `${adminPath}/features`,
        component: '@/pages/subscriptions/features',
        breadcrumb: 'route.features',
        wrappers
      },
      {
        exact: true,
        path: `${adminPath}/features/:feature`,
        component: '@/pages/subscriptions/features/[feature]',
        breadcrumb: 'route.feature',
        wrappers
      },
      {
        exact: true,
        path: `${adminPath}/notifications`,
        component: '@/pages/notifications',
        breadcrumb: 'route.notifications',
        wrappers
      },
      {
        exact: true,
        path: `${adminPath}/logs`,
        component: '@/pages/userLogs',
        breadcrumb: 'route.userLogs',
        wrappers
      },
      ...adminErrors
    ]
  };
};

module.exports = { ADMIN_ROUTES };
