import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  BugOutlined,
  InfoCircleOutlined,
  UserOutlined,
  TeamOutlined,
  CoffeeOutlined,
  PieChartOutlined,
  TrademarkOutlined,
  SolutionOutlined,
  BlockOutlined
} from '@ant-design/icons';
import { faCalendarCheck } from '@fortawesome/free-regular-svg-icons';
import { faBirthdayCake, faDiagnoses, faSearchLocation } from '@fortawesome/free-solid-svg-icons';

/**
 * @export
 * @type {[]}
 */
export const menus = [
  {
    key: 'menu:users',
    url: '/admin/users',
    icon: <UserOutlined />
  },
  {
    key: 'menu:business',
    icon: <TrademarkOutlined />,
    items: [
      {
        key: 'business:userRoles',
        url: '/admin/business/userRoles',
        icon: <SolutionOutlined />
      }
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
