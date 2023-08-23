import React from 'react';
import {
  AppstoreAddOutlined,
  ContactsOutlined,
  DiffOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  HeartOutlined,
  HistoryOutlined,
  MailOutlined,
  NotificationOutlined,
  ProfileOutlined,
  SnippetsOutlined,
  UserOutlined,
  GlobalOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { history } from '@umijs/max';

import { effectHook } from '@/utils/hooks';
import { t } from '@/utils/i18n';
import request from '@/utils/request';

export const profileMenu = {
  disabled: false,
  key: 'profile',
  icon: <ProfileOutlined/>,
  items: [
    {
      key: 'profile.account',
      url: '/profile/account',
      component: 'profile.account',
      icon: <ContactsOutlined/>,
      divider: true
    },
    {
      key: 'profile.public',
      url: '/profile/public',
      component: 'profile.public',
      icon: <UserOutlined/>
    },
    {
      key: 'profile.address',
      url: '/profile/addresses',
      component: 'profile.address',
      disabled: true,
      icon: <EnvironmentOutlined/>
    },
    {
      key: 'profile.public.email.setting',
      url: '/profile/emails',
      component: 'profile.emails',
      disabled: true,
      icon: <MailOutlined/>
    },
    {
      key: 'profile.public.logos.setting',
      url: '/profile/logos',
      component: 'profile.logos',
      icon: <AppstoreAddOutlined/>,
      disabled: true
    },
    {
      key: 'profile.public.links.setting',
      url: '/profile/links',
      component: 'profile.links',
      icon: <GlobalOutlined/>,
      disabled: true,
      divider: true
    },
    {
      key: 'profile.notifications',
      url: '/profile/notifications',
      component: 'notifications',
      icon: <NotificationOutlined/>,
      divider: true
    },
    {
      key: 'profile.network',
      url: '/profile/network',
      component: '@/pages/landing/profile/network',
      icon: <NotificationOutlined/>,
      divider: true
    }
  ]
};

export const subscriptionMenu = {
  disabled: false,
  key: 'profile.subscriptions',
  component: 'profile.subscriptions',
  icon: <SnippetsOutlined/>,
  divider: true,
  items: [
    {
      key: 'profile.assigned.subscriptions',
      url: '/profile/subscriptions',
      component: 'profile.subscriptions',
      icon: <SnippetsOutlined/>
    },
    {
      key: 'profile.subscriptions',
      url: '/profile/subscriptions/overview',
      component: 'profile.subscriptions.all',
      icon: <DiffOutlined/>
    }
  ]
};

export const apartmentMenu = {
  key: 'profile.apartments',
  url: '/profile/apartments',
  component: 'profile.apartments',
  icon: <HomeOutlined/>
};

export const historyMenu = {
  disabled: false,
  key: 'profile.history',
  icon: <HistoryOutlined/>,
  items: [
    {
      key: 'profile.history.liked',
      url: '/profile/history/liked',
      component: 'profile.history.liked',
      icon: <HeartOutlined/>
    },
    {
      key: 'profile.history.viewed',
      url: '/profile/history/viewed',
      component: 'profile.history.viewed',
      icon: <EyeOutlined/>
    }
  ]
};

/**
 * @export
 * @param sUser
 * @param intl
 * @param {string} route
 * @param {string} [redirectUri]
 */
export const preventNavigation = (sUser, intl, route, redirectUri = '/profile/public') => {
  const { messageApi } = request.xhr.notification;

  effectHook(async () => {
    if (sUser) {
      const { profileByRef } = sUser;

      if (!profileByRef) {
        messageApi.warning(t(intl, 'profile.navigation.error', { route }), 3);
        history.push(redirectUri);
      }
    }
  }, [sUser]);
};