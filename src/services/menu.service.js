import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  BugOutlined,
  InfoCircleOutlined,
  UserOutlined,
  TeamOutlined,
  TrademarkOutlined,
  SolutionOutlined
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
        key: 'business:userRoles',
        url: '/admin/userRoles',
        icon: <SolutionOutlined/>
      },
    ]
  },
  {
    key: 'menu:business',
    icon: <TrademarkOutlined/>,
    items: [
    ]
  },
  {
    key: 'menu:systemLogs',
    icon: <InfoCircleOutlined/>,
    items: [
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
