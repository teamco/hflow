import React from 'react';
import { NavLink, useIntl } from 'umi';
import {
  ContactsTwoTone,
  DownOutlined,
  PauseCircleTwoTone,
  PlayCircleTwoTone,
  SettingOutlined
} from '@ant-design/icons';

import { Avatar, Button, Dropdown, Tag, Tooltip } from 'antd';

import classnames from 'classnames';
import { tsToLocaleDateTime } from '@/utils/timestamp';
import { COLORS } from '@/utils/colors';
import { BRANDS } from '@/utils/brands';

import { showProfileModal } from 'pages/users/metadata/profile.modal';
import UserMenu from 'pages/users/metadata/users.menu';

import styles from 'pages/users/users.module.less';
import tableStyles from '@/components/Main/Table/table.module.less';
import menuStyles from '@/components/menu.less';
import { effectHook } from '@/utils/hooks';

/**
 * @export
 * @param t
 * @param ability
 * @param data
 * @param loading
 * @param multiple
 * @param visibleMessage
 * @param setVisibleMessage
 * @param currentUser
 * @param onDeleteUser
 * @param onSignOutUser
 * @param onSendMessage
 * @param onUnlockUser
 * @param onLockUser
 * @return {*}
 */
export const metadata = ({
  t,
  ability,
  data,
  loading,
  multiple,
  currentUser = {},
  setVisibleMessage,
  onDeleteUser,
  onSignOutUser,
  onSendMessage,
  onUnlockUser,
  onLockUser
}) => {

  effectHook(() => {
  }, []);
  const intl = useIntl();
  const menuProps = {
    loading,
    ability,
    currentUser,
    multiple,
    onSignOutUser,
    onSendMessage,
    onLockUser,
    onUnlockUser,
    onDeleteUser,
    setVisibleMessage
  };

  return {
    width: '100%',
    size: 'middle',
    columns: [
      {
        title: intl.formatMessage({id: 'table.name', defaultMessage: 'Name'}),
        dataIndex: 'displayName',
        key: 'displayName',
        render(name, data) {
          const isCurrentStyle = currentUser?.id === data.id ? styles.currentUser : null;
          const isSignedIn = data.metadata.signedIn;
          const color = isSignedIn ? COLORS.success : COLORS.disabled;
          const signed = {
            title: intl.formatMessage({id: isSignedIn ? 'auth.signedIn' : 'auth.signedOut', defaultMessage:  isSignedIn ? 'Signed in' : 'Sign out'}),
            icon: isSignedIn ?
                (<PlayCircleTwoTone twoToneColor={color}/>) :
                (<PauseCircleTwoTone twoToneColor={color}/>)
          };

          return (
              <div className={classnames(styles.nowrap, styles.flex)}>
                <Tooltip title={signed.title}>
                  <span className={classnames(styles.signed)}>
                    {signed.icon}
                  </span>
                </Tooltip>
                <div className={styles.avatarWrapper}>
                  {data.metadata.photoURL ? (
                      <img src={data.metadata.photoURL}
                           referrerPolicy={'no-referrer'}
                           alt={name}
                           className={styles.gridImg}/>
                  ) : (
                      <Avatar src={'https://joeschmoe.io/api/v1/random'}
                              className={styles.avatar}/>
                  )}
                </div>
                {multiple ? (
                    <NavLink to={`/admin/users/${data.id}`}>
                      <span className={isCurrentStyle}>
                        {name}
                      </span>
                    </NavLink>
                ) : (
                    <span className={isCurrentStyle}>
                      {name}
                    </span>
                )}
              </div>
          );
        },
        filterable: multiple,
        sortable: multiple
      },
      {
        title: intl.formatMessage({id: 'auth.provider', defaultMessage: 'Provider'}),
        dataIndex: 'metadata',
        render: metadata => (
            <Tag color={metadata.signedIn ? BRANDS[metadata.providerId]?.color : null}
                 icon={BRANDS[metadata.providerId]?.icon}
                 className={styles.provider}>
              {metadata.providerId}
            </Tag>
        )
      },
      // {
      //   title: t('auth:email'),
      //   dataIndex: 'email',
      //   key: 'email',
      //   filterable: multiple,
      //   sortable: multiple
      // },
      {
        title: intl.formatMessage({id: 'auth.lastSignInTime', defaultMessage: 'Last Sign In'}),
        dataIndex: 'metadata',
        key: 'lastSignInTime',
        render: metadata => tsToLocaleDateTime(+(new Date(metadata.lastSignInTime)))
      },
      {
        title: intl.formatMessage({id: 'table.action', defaultMessage: 'Action'}),
        fixed: 'right',
        width: 200,
        render: record =>
            data.length ? (
                <div className={styles.nowrap}>
                  <Tooltip title={intl.formatMessage({id: 'auth.showProfile', defaultMessage: 'Show Profile'})}>
                    <ContactsTwoTone className={tableStyles.action}
                                     onClick={() => showProfileModal(t, record)}
                                     twoToneColor={COLORS.tags.blue}/>
                  </Tooltip>
                  <Dropdown overlay={<UserMenu record={record} {...menuProps} />}
                            overlayClassName={menuStyles.customActionMenu}
                            trigger={['click']}
                            key={'custom'}>
                    <Button size={'small'}
                            icon={<SettingOutlined/>}
                            className={menuStyles.customAction}>
                      {intl.formatMessage({id: 'user.actions.manage', defaultMessage: 'Manage User'})} <DownOutlined/>
                    </Button>
                  </Dropdown>
                </div>
            ) : null
      }
    ],
    loading: loading.effects['userModel/query']
  };
};
