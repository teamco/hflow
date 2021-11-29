import React from 'react';
import {
  BugOutlined,
  FontSizeOutlined,
  InfoCircleOutlined,
  NotificationOutlined,
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
        icon: <TeamOutlined/>
      },
      {
        key: 'menu:userProfile',
        url: '/admin/profile',
        icon: <UserOutlined/>
      },
      {
        key: 'menu:manageRoles',
        url: '/admin/manageRoles',
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
        icon: <TrademarkOutlined/>
      },
      {
        key: 'menu:businessTypes',
        url: '/admin/businessTypes',
        icon: <FontSizeOutlined/>
      }
    ]
  },
  {
    key: 'menu:subscriptions',
    icon: <TrademarkOutlined/>,
    items: [
      {
        key: 'menu:subscriptionsTypes',
        url: '/admin/subscriptionsTypes',
        icon: <FontSizeOutlined/>
      },
      {
        key: 'menu:subscriptionsList',
        url: '/admin/subscriptionsList',
        icon: <FontSizeOutlined/>
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
        icon: <NotificationOutlined/>
      },
      {
        key: 'menu:userLogs',
        url: '/admin/logs',
        icon: <TeamOutlined/>
      },
      {
        key: 'menu:errorLogs',
        url: '/admin/errors',
        icon: <BugOutlined/>
      }
    ]
  }
];
