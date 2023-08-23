import React from 'react';
import { Avatar, Badge, Popover, Tooltip, version } from 'antd';
import {
  BellTwoTone,
  HeartTwoTone,
  InfoCircleTwoTone,
  LogoutOutlined,
  ProfileOutlined,
  WifiOutlined
} from '@ant-design/icons';
import { Link, useIntl } from '@umijs/max';
import classnames from 'classnames';

import DropdownButton from '@/components/Buttons/dropdown.button';

import { t } from '@/utils/i18n';
import { COLORS } from '@/utils/colors';
import { stub } from '@/utils/function';

import { isLogoutPage, isProfilePage } from '@/services/common.service';

import styles from '@/components/Landing/landing.module.less';

const { API } = require('@/services/config/api.config');

export const LandingActions = props => {
  const intl = useIntl();

  const {
    loading,
    authModel,
    notificationModel,
    collapsible = false,
    collapsed = false,
    isSider = false
  } = props;

  const { user, location, ability } = authModel;
  const { isOnline, notificationBadge } = notificationModel;

  const cantLogout = ability.cannot('logout', 'landing.logout');

  const logOutUrl = location?.pathname && !isLogoutPage(location?.pathname) ?
      `/logout?referrer=${encodeURIComponent(location?.pathname)}` :
      '/logout';

  /**
   * @constant
   * @param {string} idx
   * @param {string} title
   * @param {string} value
   * @param {boolean} [translate]
   * @returns {JSX.Element}
   */
  const info = (idx, title, value, translate = true) => (
      <li key={idx}>
        <strong>{translate ? t(intl, title) : title}</strong>{value.toString()}
      </li>
  );

  const menuItems = [
    {
      label: (
          <div>
            <Link to={'/profile'} disabled={isProfilePage(location?.pathname)}>
              {t(intl, 'user.profile')}
            </Link>
          </div>
      ),
      key: 'profile',
      icon: <ProfileOutlined/>
    },
    { type: 'divider' },
    {
      label: (
          <div>
            <Link to={logOutUrl}
                  onClick={stub}
                  disabled={isLogoutPage(location?.pathname) || cantLogout}>
              {t(intl, 'auth.signOut')}
            </Link>
          </div>
      ),
      key: 'signOut',
      icon: <LogoutOutlined/>
    }
  ];

  const actionPosition = isSider ?
      collapsed ? 'right' :
          'topRight' : 'bottom';

  return (
      <div className={classnames(styles.actionsWrapper, {
        [styles.siderActions]: isSider,
        [styles.siderCollapsed]: collapsible && collapsed,
        [styles.collapsible]: collapsible
      })}>
        <div className={styles.actions}>
          <Tooltip placement={actionPosition}
                   title={isOnline ?
                       t(intl, 'msg.connected') :
                       t(intl, 'error.noConnection')}>
            <WifiOutlined style={{ color: isOnline ? COLORS.success : COLORS.danger }}/>
          </Tooltip>
          <Popover placement={actionPosition}
                   title={t(intl, 'info.build')}
                   content={(
                       <ul className={styles.info}>
                         {info('platform', 'info.platform', OS_PLATFORM.toString().toUpperCase())}
                         {info('node', 'NodeJs', NODE_VERSION, false)}
                         <li key={0} className={styles.divider}/>
                         {info('react', 'React', React.version, false)}
                         {info('umi', 'UMI.js', window?.g_umi?.version, false)}
                         {info('antd', 'Ant.Design', version, false)}
                         <li key={1} className={styles.divider}/>
                         {info('mode', 'info.mode', NODE_ENV)}
                         {info('debug', 'info.debug', DEBUG)}
                         {info('proxy', 'info.proxy', CORPORATE_PROXY)}
                         <li key={2} className={styles.divider}/>
                         {info('version', 'info.version', VERSION)}
                       </ul>
                   )}
                   trigger={'click'}>
            <InfoCircleTwoTone/>
          </Popover>
          <HeartTwoTone twoToneColor={'#ccc'}/>
          {user ? (
              <Link to={`/admin/notifications`}>
                <Badge {...notificationBadge}>
                  <BellTwoTone twoToneColor={'#ccc'}/>
                </Badge>
              </Link>
          ) : null}
        </div>
        <div className={styles.auth}>
          {user ? (
              <div>
                {/*<div className={styles.actions}>*/}
                {/*<Link to={`/admin/users/${user.id}/notifications`}*/}
                {/*      className={styles.ads}>*/}
                {/*  <PlusOutlined/>*/}
                {/*  {t(intl, 'landing.ads')}*/}
                {/*</Link>*/}
                {/*</div>*/}
                <DropdownButton key={'manage'}
                                overlay={menuItems}
                                data-testid={'auth-mng'}
                                spinOn={['authModel/signOut']}
                                disabled={false}
                                loading={loading}
                                placement={actionPosition}>
                  <div>
                    {user.metadata.photoURL ? (
                        <img src={user.metadata.photoURL}
                             alt={user.displayName}
                             referrerPolicy={'no-referrer'}/>
                    ) : (
                        <Avatar src={API.avatar}/>
                    )}
                    <span>{user.displayName}</span>
                  </div>
                </DropdownButton>
              </div>
          ) : (
              <Link to={'/login'}>
                {t(intl, 'auth.signIn')}
              </Link>
          )}
        </div>
      </div>
  );
};