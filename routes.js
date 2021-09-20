export const routes = [
  {
    exact: false,
    path: '/',
    component: '@/layouts/landing.layout',
    routes: [
      {
        exact: true,
        path: '/',
        component: '@/pages/landing'
      },
      {
        exact: false,
        path: '/admin',
        component: '@/layouts/app.layout',
        routes: [
          {
            exact: true,
            path: '/admin/finishSignUp/:user',
            title: 'route:finishSignUp',
            component: '@/pages/finishSignUp'
          },
          {
            exact: true,
            path: '/admin',
            title: 'route:home',
            component: '@/pages/home',
            wrappers: [
              '@/wrappers/auth.wrapper'
            ]
          },
          {
            exact: true,
            path: '/admin/users',
            component: '@/pages/users',
            title: 'route:users',
            wrappers: [
              '@/wrappers/auth.wrapper'
            ]
          },
          {
            exact: true,
            path: '/admin/users/:user',
            component: '@/pages/users/[user]/profile',
            title: 'route:userProfile',
            wrappers: [
              '@/wrappers/auth.wrapper'
            ]
          },
          {
            exact: true,
            path: '/admin/users/:user/businesses',
            component: '@/pages/users/[user]/businesses',
            title: 'route:businesses',
            wrappers: [
              '@/wrappers/auth.wrapper'
            ]
          },
          {
            exact: true,
            path: '/admin/users/:user/businesses/:business',
            component: '@/pages/users/[user]/businesses/[business]/business.edit',
            title: 'route:business',
            wrappers: [
              '@/wrappers/auth.wrapper'
            ]
          },
          {
            exact: true,
            path: '/admin/users/:user/businesses/:business/users',
            component: '@/pages/users/[user]/businesses/[business]/users',
            title: 'route:businessUsers',
            wrappers: [
              '@/wrappers/auth.wrapper'
            ]
          },
          {
            exact: true,
            path: '/admin/business/userRoles',
            component: '@/pages/business/userRoles',
            title: 'route:userRoles',
            wrappers: [
              '@/wrappers/auth.wrapper'
            ]
          },
          {
            exact: true,
            path: '/admin/logs',
            component: '@/pages/userLogs',
            title: 'route:userLogs',
            wrappers: [
              '@/wrappers/auth.wrapper'
            ]
          },
          {
            component: '@/pages/404',
            title: 'route:page404'
          }
        ]
      }
    ]
  }
];
