export const routes = [
  {
    exact: false,
    path: '/',
    component: '@/layouts/landing',
    routes: [
      {
        exact: true,
        path: '/',
        component: '@/pages/landing'
      },
      {
        exact: true,
        path: '/subscription',
        breadcrumb: 'route:subscription',
        component: '@/pages/subscription'
      },
      {
        exact: false,
        path: '/admin',
        component: '@/layouts/app',
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
            path: '/admin/users/:user/businesses',
            component: '@/pages/users/[user]/businesses',
            breadcrumb: 'route:businesses',
            wrappers: [
              '@/wrappers/auth.wrapper'
            ]
          },
          {
            exact: true,
            path: '/admin/users/:user/businesses/:business',
            component: '@/pages/users/[user]/businesses/[business]',
            breadcrumb: 'route:business',
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
          }
        ]
      },
      {
        component: '@/pages/404',
        breadcrumb: 'route:page404'
      }
    ]
  }
];
