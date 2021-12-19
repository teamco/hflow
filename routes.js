export const routes = [
  {
    exact: false,
    path: '/',
    component: '@/layouts/landing',
    routes: [
      {
        exact: true,
        path: '/',
        breadcrumb: 'route:home',
        component: '@/pages/landing'
      },
      {
        exact: true,
        path: '/subscriptions',
        breadcrumb: 'route:subscriptions',
        component: '@/pages/subscriptions'
      },
      {
        exact: false,
        path: '/admin',
        component: '@/layouts/app',
        breadcrumb: 'route:admin',
        routes: [
          {
            exact: true,
            path: '/admin/finishSignUp/:user',
            breadcrumb: 'route:finishSignUp',
            component: '@/pages/finishSignUp'
          },
          {
            exact: true,
            path: '/admin',
            breadcrumb: 'route:home',
            component: '@/pages/home',
            wrappers: [
              '@/wrappers/auth.wrapper'
            ]
          },
          {
            exact: true,
            path: '/admin/users',
            component: '@/pages/users',
            breadcrumb: 'route:users',
            wrappers: [
              '@/wrappers/auth.wrapper'
            ]
          },
          {
            exact: true,
            path: '/admin/profile',
            component: '@/pages/users/[user]/profile',
            breadcrumb: 'route:userProfile',
            wrappers: [
              '@/wrappers/auth.wrapper'
            ]
          },
          {
            exact: true,
            path: '/admin/users/:user',
            component: '@/pages/users/[user]/profile',
            breadcrumb: 'route:userProfile',
            wrappers: [
              '@/wrappers/auth.wrapper'
            ]
          },
          {
            exact: true,
            path: '/admin/users/:user/notifications',
            component: '@/pages/notifications',
            breadcrumb: 'route:notifications',
            wrappers: [
              '@/wrappers/auth.wrapper'
            ]
          },
          {
            exact: true,
            path: '/admin/businesses',
            component: '@/pages/users/[user]/businesses',
            breadcrumb: 'route:businesses',
            wrappers: [
              '@/wrappers/auth.wrapper'
            ]
          },
          {
            exact: true,
            path: '/admin/users/:user/businesses',
            component: '@/pages/users/[user]/businesses',
            breadcrumb: 'route:businesses',
            wrappers: [
              '@/wrappers/auth.wrapper'
            ]
          },
          {
            exact: true,
            path: '/admin/businesses/:business/edit',
            component: '@/pages/users/[user]/businesses/[business]',
            breadcrumb: 'route:businessEdit',
            wrappers: [
              '@/wrappers/auth.wrapper'
            ]
          },
          {
            exact: true,
            path: '/admin/businesses/:business',
            component: '@/pages/users/[user]/businesses/[business]/show',
            breadcrumb: 'route:businessShow',
            wrappers: [
              '@/wrappers/auth.wrapper'
            ]
          },
          {
            exact: true,
            path: '/admin/users/:user/businesses/:business/edit',
            component: '@/pages/users/[user]/businesses/[business]',
            breadcrumb: 'route:businessEdit',
            wrappers: [
              '@/wrappers/auth.wrapper'
            ]
          },
          {
            exact: true,
            path: '/admin/users/:user/businesses/:business',
            component: '@/pages/users/[user]/businesses/[business]/show',
            breadcrumb: 'route:businessShow',
            wrappers: [
              '@/wrappers/auth.wrapper'
            ]
          },
          {
            exact: true,
            path: '/admin/users/:user/businesses/:business/users',
            component: '@/pages/users/[user]/businesses/[business]/users',
            breadcrumb: 'route:businessUsers',
            wrappers: [
              '@/wrappers/auth.wrapper'
            ]
          },
          {
            exact: true,
            path: '/admin/manageRoles',
            component: '@/pages/userRoles',
            breadcrumb: 'route:manageRoles',
            wrappers: [
              '@/wrappers/auth.wrapper'
            ]
          },
          {
            exact: true,
            path: '/admin/businessTypes',
            component: '@/pages/business/types',
            breadcrumb: 'route:businessTypes',
            wrappers: [
              '@/wrappers/auth.wrapper'
            ]
          },
          {
            exact: true,
            path: '/admin/campaigns',
            component: '@/pages/campaigns',
            breadcrumb: 'route:campaigns',
            wrappers: [
              '@/wrappers/auth.wrapper'
            ]
          },
          {
            exact: true,
            path: '/admin/campaigns/:campaign',
            component: '@/pages/campaigns/[campaign]',
            breadcrumb: 'route:campaign',
            wrappers: [
              '@/wrappers/auth.wrapper'
            ]
          },
          {
            exact: true,
            path: '/admin/subscriptions',
            component: '@/pages/subscriptions',
            breadcrumb: 'route:subscriptions',
            wrappers: [
              '@/wrappers/auth.wrapper'
            ]
          },
          {
            exact: true,
            path: '/admin/subscriptions/:subscription',
            component: '@/pages/subscriptions/[subscription]',
            breadcrumb: 'route:subscription',
            wrappers: [
              '@/wrappers/auth.wrapper'
            ]
          },
          {
            exact: true,
            path: '/admin/subscriptionTypes',
            component: '@/pages/subscriptions/types',
            breadcrumb: 'route:subscriptionTypes',
            wrappers: [
              '@/wrappers/auth.wrapper'
            ]
          },
          {
            exact: true,
            path: '/admin/preferenceTypes',
            component: '@/pages/subscriptions/preferences/types',
            breadcrumb: 'route:preferenceTypes',
            wrappers: [
              '@/wrappers/auth.wrapper'
            ]
          },
          {
            exact: true,
            path: '/admin/subscriptionPrefs',
            component: '@/pages/subscriptions/preferences',
            breadcrumb: 'route:subscriptionPrefs',
            wrappers: [
              '@/wrappers/auth.wrapper'
            ]
          },
          {
            exact: true,
            path: '/admin/subscriptionPrefs/:preference',
            component: '@/pages/subscriptions/preferences/[preference]',
            breadcrumb: 'route:subscriptionPref',
            wrappers: [
              '@/wrappers/auth.wrapper'
            ]
          },
          {
            exact: true,
            path: '/admin/notifications',
            component: '@/pages/notifications',
            breadcrumb: 'route:notifications',
            wrappers: [
              '@/wrappers/auth.wrapper'
            ]
          },
          {
            exact: true,
            path: '/admin/logs',
            component: '@/pages/userLogs',
            breadcrumb: 'route:userLogs',
            wrappers: [
              '@/wrappers/auth.wrapper'
            ]
          },
          {
            component: '@/pages/403',
            breadcrumb: 'route:page403',
            path: '/admin/errors/403'
          },
          {
            component: '@/pages/404',
            breadcrumb: 'route:page404',
            path: '/admin/errors/404'
          }
        ]
      }
    ]
  }
];
