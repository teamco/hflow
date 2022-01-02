import React from 'react';
import {
  ApiOutlined,
  ControlOutlined,
  DollarOutlined,
  FontSizeOutlined,
  FundOutlined,
  InfoCircleOutlined,
  NotificationOutlined,
  ShoppingCartOutlined,
  SolutionOutlined,
  TeamOutlined,
  TrademarkOutlined,
  UserOutlined
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
        key: 'menu:subscriptionTypes',
        url: '/admin/subscriptionTypes',
        component: 'subscriptionTypes',
        icon: <FontSizeOutlined/>
      },
      { divider: true },
      {
        key: 'menu:features',
        url: '/admin/features',
        component: 'features',
        icon: <ControlOutlined/>
      },
      {
        key: 'menu:featureTypes',
        url: '/admin/featureTypes',
        component: 'featureTypes',
        icon: <FontSizeOutlined/>
      },
      { divider: true },
      {
        key: 'menu:campaigns',
        url: '/admin/campaigns',
        component: 'campaigns',
        icon: <FundOutlined/>
      },
      { divider: true },
      {
        key: 'menu:currencies',
        url: '/admin/currencies',
        component: 'currencies',
        icon: <DollarOutlined/>
      }
    ]
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
