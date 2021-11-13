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
        key: 'menu:businessTypes',
        url: '/admin/businessTypes',
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
