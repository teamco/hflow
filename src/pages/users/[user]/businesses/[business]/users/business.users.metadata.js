import React, {useState} from 'react';
import {
  PauseCircleTwoTone,
  PlayCircleTwoTone,
  SettingOutlined,
  DownOutlined,
  MailTwoTone,
  CalendarTwoTone,
  SyncOutlined
} from '@ant-design/icons';

import {
  Col,
  Row,
  Button,
  Dropdown,
  Tag,
  Tooltip
} from 'antd';

import classnames from 'classnames';
import {tsToLocaleDateTime} from 'utils/timestamp';
import EmailVerified from 'components/Profile/email.verified';
import BusinessUserMenu from './metadata/business.user.menu';

import {getRoleIcon} from 'pages/users/[user]/profile/profile.metadata';
import {COLORS} from 'utils/colors';

import styles from 'pages/users/users.module.less';
import menuStyles from 'components/menu.less';

/**
 * @export
 * @param t
 * @param data
 * @param ability
 * @param currentUser
 * @param setVisibleMessage
 * @param loading
 * @param multiple
 * @param onAssignUser
 * @param onUnassignUser
 * @param onResendRegisterLink
 * @return {*}
 */
export const metadata = ({
  t,
  ability,
  currentUser,
  data,
  loading,
  multiple,
  setVisibleMessage,
  onAssignUser,
  onUnassignUser,
  onResendRegisterLink
}) => {

  const menuProps = {
    ability,
    loading,
    currentUser,
    onUnassignUser,
    setVisibleMessage,
    onResendRegisterLink
  };

  return {
    width: '100%',
    size: 'middle',
    columns: [
      {
        title: t('table:name'),
        dataIndex: 'displayName',
        key: 'displayName',
        render(name, data) {
          const {pending, signedIn} = data?.metadata || {};
          const color = signedIn ? COLORS.success : COLORS.disabled;
          const signed = {
            title: t(signedIn ? 'auth:signedIn' : 'auth:signedOut'),
            icon: signedIn ?
                (<PlayCircleTwoTone twoToneColor={color}/>) :
                (<PauseCircleTwoTone twoToneColor={color}/>)
          };

          return (
              <div className={styles.nowrap}>
                <Tooltip title={signed.title}>
                <span className={classnames(styles.signed)}>
                  {signed.icon}
                </span>
                </Tooltip>
                <span>
                  {pending ? (
                          <Tag icon={<SyncOutlined spin/>}
                               color={COLORS.tags.processing}>
                            {t('auth:pending')}
                          </Tag>
                      ) :
                      name}
                </span>
              </div>
          );
        },
        filterable: multiple,
        sortable: multiple
      },
      {
        title: t('auth:roles'),
        dataIndex: ['userRoles'],
        key: 'roles',
        render(currentRoles) {
          return (
              <div>
                {currentRoles?.map((role, idx) => (
                    <Tag className={styles.rules}
                         style={{marginBottom: 3}}
                         key={`cr.${idx}`}
                         closable={false}
                         icon={getRoleIcon(role)}>
                      {role}
                    </Tag>
                ))}
              </div>
          );
        }
      },
      {
        title: t('auth:lastSignInTime'),
        dataIndex: 'metadata',
        key: 'lastSignInTime',
        render: metadata => metadata?.pending ? t('error:na') :
            tsToLocaleDateTime(+(new Date(metadata.lastSignInTime)))
      },
      {
        title: t('table:action'),
        render: record => data.length ? (
            <div className={styles.nowrap}>
              <Dropdown overlay={<BusinessUserMenu record={record} {...menuProps} />}
                        overlayClassName={menuStyles.customActionMenu}
                        key={'custom'}>
                <Button size={'small'}
                        icon={<SettingOutlined/>}
                        className={menuStyles.customAction}>
                  {t('actions:manage', {type: t('menu:users')})} <DownOutlined/>
                </Button>
              </Dropdown>
            </div>
        ) : null
      }
    ],
    loading: loading.effects['userModel/query']
  };
};
