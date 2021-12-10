import React from 'react';
import {
  BugOutlined,
  FontSizeOutlined,
  InfoCircleOutlined,
  NotificationOutlined,
  SolutionOutlined,
  TeamOutlined,
  TrademarkOutlined,
  UserOutlined,
  ApiOutlined,
  ShoppingCartOutlined,
  ControlOutlined
} from '@ant-design/icons';

/**
 * @export
 * @type {[]}
 */
export const menus = [
  {
    key: 'menu:manageUsers',
    icon: <UserOutlined/>,
    items: [
      {
        key: 'menu:users',
        url: '/admin/users',
        component: 'users',
        icon: <TeamOutlined/>
      },
      {
        key: 'menu:userProfile',
        url: '/admin/profile',
        component: 'profile',
        icon: <UserOutlined/>
      },
      {
        key: 'menu:manageRoles',
        url: '/admin/manageRoles',
        component: 'roles',
        icon: <SolutionOutlined/>
      }
    ]
  },
  {
    key: 'menu:business',
    icon: <TrademarkOutlined/>,
    items: [
      {
        key: 'menu:businesses',
        url: '/admin/businesses',
        component: 'businesses',
        icon: <TrademarkOutlined/>
      },
      {
        key: 'menu:businessTypes',
        url: '/admin/businessTypes',
        component: 'businessTypes',
        icon: <FontSizeOutlined/>
      }
    ]
  },
  {
    key: 'menu:subscription',
    icon: <ApiOutlined/>,
    items: [
      {
        key: 'menu:subscriptions',
        url: '/admin/subscriptions',
        component: 'subscriptions',
        icon: <ShoppingCartOutlined/>
      },
      {
        key: 'menu:subscriptionPrefs',
        url: '/admin/subscriptionPrefs',
        component: 'subscriptionPrefs',
        icon: <ControlOutlined/>
      },
      {
        key: 'menu:subscriptionTypes',
        url: '/admin/subscriptionTypes',
        component: 'subscriptionTypes',
        icon: <FontSizeOutlined />
      }
    ]
  },
  {
    key: 'menu:campaign',
    icon: <ApiOutlined/>,
    items: [
      {
        key: 'menu:campaigns',
        url: '/admin/campaigns',
        component: 'campaigns',
        icon: <FontSizeOutlined />
      }
    ],
  },
  {
    key: 'menu:systemLogs',
    icon: <InfoCircleOutlined/>,
    items: [
      {
        key: 'menu:notifications',
        url: '/admin/notifications',
        component: 'notifications',
        icon: <NotificationOutlined/>
      }
      // {
      //   key: 'menu:userLogs',
      //   url: '/admin/logs',
      //   component: 'userLogs',
      //   icon: <TeamOutlined />
      // },
      // {
      //   key: 'menu:errorLogs',
      //   url: '/admin/errors',
      //   component: 'errorLogs',
      //   icon: <BugOutlined />
      // }
    ]
  }
];
