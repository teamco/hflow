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
        key: 'business:preparations',
        url: '/admin/business/preparations',
        icon: <PieChartOutlined />
      },
      {
        key: 'business:services',
        url: '/admin/business/services',
        icon: <CoffeeOutlined />
      },
      {
        key: 'business:userRoles',
        url: '/admin/business/userRoles',
        icon: <SolutionOutlined />
      }
    ]
  },
  {
    key: 'menu:businessWizard',
    icon: <BlockOutlined />,
    items: [
      {
        key: 'business:dietary',
        url: '/admin/business/wizard/dietary',
        icon: <FontAwesomeIcon icon={faDiagnoses}/>
      },
      {
        key: 'business:eventLocation',
        url: '/admin/business/wizard/eventLocation',
        icon: <FontAwesomeIcon icon={faSearchLocation}/>
      },
      {
        key: 'business:eventType',
        url: '/admin/business/wizard/eventType',
        icon: <FontAwesomeIcon icon={faCalendarCheck}/>
      },
      {
        key: 'business:startersAndDesserts',
        url: '/admin/business/wizard/startersAndDesserts',
        icon: <FontAwesomeIcon icon={faBirthdayCake}/>
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
