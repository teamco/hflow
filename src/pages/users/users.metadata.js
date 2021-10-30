import React, {useEffect} from 'react';
import {NavLink} from 'umi';
import {
  PauseCircleTwoTone,
  PlayCircleTwoTone,
  ContactsTwoTone,
  MehTwoTone,
  SettingOutlined,
  DownOutlined
} from '@ant-design/icons';

import {Tooltip, Tag, Button, Dropdown} from 'antd';

import classnames from 'classnames';
import {tsToLocaleDateTime} from 'utils/timestamp';
import {COLORS} from 'utils/colors';
import {BRANDS} from 'utils/brands';

import {showProfileModal} from 'pages/users/metadata/profile.modal';
import UserMenu from 'pages/users/metadata/users.menu';

import styles from 'pages/users/users.module.less';
import tableStyles from 'components/Main/Table/table.module.less';
import menuStyles from 'components/menu.less';

/**
 * @export
 * @param t
 * @param ability
 * @param data
 * @param loading
 * @param multiple
 * @param rowEnabled
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
  rowEnabled,
  currentUser = {},
  setVisibleMessage,
  onDeleteUser,
  onSignOutUser,
  onSendMessage,
  onUnlockUser,
  onLockUser
}) => {

  useEffect(() => {
  }, []);

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
        title: t('table:name'),
        dataIndex: 'displayName',
        key: 'displayName',
        render(name, data) {
          const isCurrentStyle = currentUser?.uid === data.uid ? styles.currentUser : null;
          const isSignedIn = data.metadata.signedIn;
          const color = isSignedIn ? COLORS.success : COLORS.disabled;
          const signed = {
            title: t(isSignedIn ? 'auth:signedIn' : 'auth:signedOut'),
            icon: isSignedIn ?
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
                {data.metadata.photoURL ? (
                    <img src={data.metadata.photoURL}
                         referrerPolicy={'no-referrer'}
                         alt={name}
                         className={styles.gridImg}/>
                ) : (<MehTwoTone style={{marginRight: 10, width: 20}}/>)}
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
        title: t('auth:provider'),
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
        title: t('auth:lastSignInTime'),
        dataIndex: 'metadata',
        key: 'lastSignInTime',
        render: metadata => tsToLocaleDateTime(+(new Date(metadata.lastSignInTime)))
      },
      {
        title: t('table:action'),
        render: record =>
            data.length ? (
                <div className={styles.nowrap}>
                  <Tooltip title={t('auth:showProfile')}>
                    <ContactsTwoTone className={tableStyles.action}
                                     onClick={() => showProfileModal(t, record)}
                                     twoToneColor={COLORS.success}/>
                  </Tooltip>
                  <Dropdown overlay={<UserMenu record={record} {...menuProps} />}
                            overlayClassName={menuStyles.customActionMenu}
                            trigger={['click']}
                            key={'custom'}>
                    <Button size={'small'}
                            icon={<SettingOutlined/>}
                            className={menuStyles.customAction}>
                      {t('actions:manage', {type: t('auth:user')})} <DownOutlined/>
                    </Button>
                  </Dropdown>
                </div>
            ) : null
      }
    ],
    loading: loading.effects['userModel/query']
  };
};
