import React from 'react';
import { NavLink } from '@umijs/max';
import {
  ContactsTwoTone,
  PauseCircleTwoTone,
  PlayCircleTwoTone
} from '@ant-design/icons';

import { Avatar, Tag, Tooltip } from 'antd';
import classnames from 'classnames';

import { tsToLocaleDateTime } from '@/utils/timestamp';
import { COLORS } from '@/utils/colors';
import { BRANDS } from '@/utils/brands';
import { t } from '@/utils/i18n';

import { showProfileModal } from '@/pages/users/metadata/profile.modal';
import { userMenu } from '@/pages/users/metadata/users.menu';
import DropdownButton from '@/components/Buttons/dropdown.button';

import styles from '@/pages/users/users.module.less';
import tableStyles from '@/components/Main/Table/table.module.less';

const { API } = require('@/services/config/api.config');

/**
 * @export
 * @param props
 * @return {*}
 */
export const metadata = (props) => {
  const {
    ability,
    data,
    disabled = false,
    intl,
    loading,
    multiple,
    modal,
    currentUser = {},
    setVisibleMessage,
    onDeleteUser,
    onSignOutUser,
    onSendMessage,
    onUnlockUser,
    onLockUser
  } = props;

  const menuProps = {
    loading,
    ability,
    intl,
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
        title: t(intl, 'table.name'),
        dataIndex: 'displayName',
        key: 'displayName',
        render(name, data) {
          const isCurrentStyle = currentUser?.id === data.id ? styles.currentUser : null;
          const isSignedIn = data.metadata.signedIn;
          const color = isSignedIn ? COLORS.success : COLORS.disabled;
          const signed = {
            title: t(intl, isSignedIn ? 'auth.signedIn' : 'auth.signedOut'),
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
                           alt={name}
                           referrerPolicy={'no-referrer'}
                           className={styles.gridImg}/>
                  ) : (
                      <Avatar src={API.avatar}
                              className={styles.avatar}/>
                  )}
                </div>
                {multiple ? (
                    <NavLink to={`/admin/users/${data?.id}`}>
                      <span className={isCurrentStyle}>{name}</span>
                    </NavLink>
                ) : (
                    <span className={isCurrentStyle}>{name}</span>
                )}
              </div>
          );
        },
        filterable: multiple,
        sortable: multiple
      },
      {
        title: t(intl, 'auth.provider'),
        dataIndex: 'metadata',
        render: metadata => (
            <Tag color={metadata.signedIn ? BRANDS[metadata.providerId]?.color : null}
                 icon={BRANDS[metadata.providerId]?.icon}
                 className={styles.provider}>
              {metadata.providerId}
            </Tag>
        )
      },
      {
        title: t(intl, 'user.type'),
        render: (data) => data.business ?
            (<strong>{t(intl, 'user.business')}</strong>) :
            t(intl, 'user.regular')
      },
      {
        title: t(intl, 'auth.lastSignInTime'),
        dataIndex: 'metadata',
        key: 'lastSignInTime',
        render: metadata => tsToLocaleDateTime(+(new Date(metadata.lastSignInTime)))
      },
      {
        title: t(intl, 'table.action'),
        fixed: 'right',
        width: 200,
        render: record =>
            data.length ? (
                <div className={styles.nowrap}>
                  <Tooltip title={t(intl, 'auth.showProfile')}>
                    <ContactsTwoTone className={tableStyles.action}
                                     onClick={() => showProfileModal({ ...record }, modal, intl)}
                                     twoToneColor={COLORS.tags.blue}/>
                  </Tooltip>
                  <DropdownButton key={'manage'}
                                  overlay={userMenu({ record, ...menuProps })}
                                  data-testid={'user-mng'}
                                  disabled={disabled}
                                  loading={loading}
                                  label={t(intl, 'user.actions.manage')}/>
                </div>
            ) : null
      }
    ],
    loading: loading.effects['userModel/query']
  };
};
