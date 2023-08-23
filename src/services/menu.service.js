import React from 'react';
import {
  ApiOutlined,
  ControlOutlined,
  DollarOutlined,
  FieldTimeOutlined,
  FontSizeOutlined,
  FundOutlined,
  InfoCircleOutlined,
  NotificationOutlined,
  ShoppingCartOutlined,
  SolutionOutlined,
  TeamOutlined,
  ScheduleOutlined,
  TrademarkOutlined,
  UserOutlined,
  HomeOutlined
} from '@ant-design/icons';

/**
 * @export
 * @type {[]}
 */
export const menus = [
  {
    key: 'menu.manageUsers',
    icon: <UserOutlined/>,
    items: [
      {
        key: 'menu.users',
        url: '/admin/users',
        component: 'users',
        icon: <TeamOutlined/>
      },
      {
        key: 'menu.userProfile',
        url: '/admin/profile',
        component: 'profile',
        icon: <UserOutlined/>,
        divider: true
      },
      {
        key: 'menu.businessRoles',
        url: '/admin/roles/business',
        component: 'business.roles',
        icon: <SolutionOutlined/>
      },
      {
        key: 'menu.userRoles',
        url: '/admin/roles/user',
        component: 'user.roles',
        icon: <SolutionOutlined/>,
        divider: true
      },
      {
        key: 'menu.abilityRoles',
        url: '/admin/roles/ability',
        component: 'ability.roles',
        icon: <SolutionOutlined/>
      },
      {
        key: 'menu.componentRoles',
        url: '/admin/roles/component',
        component: 'component.roles',
        icon: <SolutionOutlined/>,
        divider: true
      },
      {
        key: 'menu.rolesManager',
        url: '/admin/roles/manager',
        component: 'role.manager',
        icon: <SolutionOutlined/>
      }
    ]
  },
  {
    key: 'menu.business',
    icon: <TrademarkOutlined/>,
    items: [
      {
        key: 'menu.businesses',
        url: '/admin/businesses',
        component: 'businesses',
        icon: <TrademarkOutlined/>
      },
      {
        key: 'menu.businessTypes',
        url: '/admin/businessTypes',
        component: 'business.types',
        icon: <FontSizeOutlined/>
      }
    ]
  },
  {
    key: 'menu.subscription',
    icon: <ApiOutlined/>,
    items: [
      {
        key: 'menu.subscriptions',
        url: '/admin/subscriptions',
        component: 'subscriptions',
        icon: <ShoppingCartOutlined/>
      },
      {
        key: 'menu.subscriptionTypes',
        url: '/admin/subscriptionTypes',
        component: 'subscription.types',
        icon: <FontSizeOutlined/>,
        divider: true
      },
      {
        key: 'menu.schedulers',
        url: '/admin/schedulers',
        component: 'schedulers',
        icon: <ScheduleOutlined/>,
        divider: true
      },
      {
        key: 'menu.features',
        url: '/admin/features',
        component: 'features',
        icon: <ControlOutlined/>
      },
      {
        key: 'menu.featureTypes',
        url: '/admin/featureTypes',
        component: 'feature.types',
        icon: <FontSizeOutlined/>,
        divider: true
      },
      {
        key: 'menu.campaigns',
        url: '/admin/campaigns',
        component: 'campaigns',
        icon: <FundOutlined/>,
        divider: true
      },
      {
        key: 'menu.currencies',
        url: '/admin/currencies',
        component: 'currencies',
        icon: <DollarOutlined/>,
        divider: true
      },
      {
        key: 'menu.durationTypes',
        url: '/admin/durationTypes',
        component: 'duration.types',
        icon: <FieldTimeOutlined/>
      }
    ]
  },
  {
    key: 'menu.properties',
    url: '/admin/properties',
    component: 'properties',
    icon: <HomeOutlined/>
  },
  {
    key: 'menu.systemLogs',
    icon: <InfoCircleOutlined/>,
    items: [
      {
        key: 'menu.notifications',
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

/**
 * @export
 * @param [menuItems]
 * @param {boolean} [disabled]
 * @return {*}
 */
export const handleDisabledMenus = (menuItems = [], disabled = false) => {

  /**
   * @function
   * @param data
   * @return {*}
   * @private
   */
  function _handleDisabled(data) {
    return data.map(item => {
      if (item.disabled) {
        item.disabled = disabled;
      }

      if (item.items?.length) {
        item.items = _handleDisabled(item.items);
      }

      return item;
    });
  }

  return _handleDisabled([...menuItems]);
};