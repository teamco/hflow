import React from 'react';
import { Popconfirm } from 'antd';
import {
  ApiTwoTone,
  DeleteTwoTone,
  LockTwoTone,
  MessageTwoTone,
  NotificationTwoTone,
  ProfileTwoTone,
  TrademarkCircleTwoTone,
  UnlockTwoTone
} from '@ant-design/icons';

import { NavLink } from '@umijs/max';

import { COLORS } from '@/utils/colors';
import { t } from '@/utils/i18n';

import tableStyles from '@/components/Main/Table/table.module.less';

/**
 * @export
 * @param props
 * @return {*[]}
 */
export const userMenu = props => {
  const {
    ability,
    loading,
    intl,
    record,
    currentUser,
    multiple,
    onSignOutUser,
    onLockUser,
    onUnlockUser,
    onDeleteUser,
    setVisibleMessage
  } = props;

  const {
    isLocked,
    signedIn
  } = record.metadata;

  const dividerItem = { type: 'divider' };

  const multipleItems = multiple ? [
    {
      label: (
          <NavLink to={`/admin/users/${record?.id}`}>
            {t(intl, 'menu.userProfile')}
          </NavLink>
      ),
      key: 'profile',
      icon: <ProfileTwoTone className={tableStyles.action}
                            twoToneColor={COLORS.success}/>
    }
  ] : [];

  const basicItems = [
    {
      label: (
          <NavLink to={`/admin/users/${record?.id}/businesses`}>
            {t(intl, 'route.businesses')}
          </NavLink>
      ),
      key: 'businesses',
      icon: <TrademarkCircleTwoTone className={tableStyles.action}
                                    twoToneColor={COLORS.success}/>
    },
    dividerItem,
    {
      label: (
          <NavLink to={`/admin/users/${record?.id}/notifications`}>
            {t(intl, 'route.notifications')}
          </NavLink>
      ),
      key: 'notifications',
      icon: <NotificationTwoTone className={tableStyles.action}
                                 twoToneColor={COLORS.warning}/>
    }
  ];

  const currentItems = currentUser?.uid !== record.uid ? [
    {
      label: (
          <div onClick={() => {
            setVisibleMessage({ visible: true, props: { from: currentUser, to: record } });
          }}>
            {t(intl, 'auth.sendMessage')}
          </div>
      ),
      key: 'message',
      icon: <MessageTwoTone className={tableStyles.action}
                            twoToneColor={COLORS.warning}/>
    }
  ] : [];

  const lockedItems = [
    {
      label: isLocked ? (
          <Popconfirm title={t(intl, 'auth.unlockConfirm', { instance: record.email })}
                      placement={'topRight'}
                      disabled={true}
                      onConfirm={() => onUnlockUser(record)}>
            {t(intl, 'auth.unlock')}
          </Popconfirm>
      ) : (
          <div onClick={() => onLockUser(record)}>
            {t(intl, 'auth.lock')}
          </div>
      ),
      key: 'lock',
      icon: isLocked ?
          (<LockTwoTone className={tableStyles.action}/>) :
          (<UnlockTwoTone twoToneColor={COLORS.danger}
                          className={tableStyles.action}/>)
    }
  ];

  const forceSignOut = [
    {
      label: signedIn ? (
          <Popconfirm title={t(intl, 'auth.signOutConfirm', { instance: record.email })}
                      placement={'topRight'}
                      disabled={true}
                      onConfirm={() => onSignOutUser(record)}>
            {t(intl, 'auth.forceSignOut')}
          </Popconfirm>
      ) : t(intl, 'auth.forceSignOut'),
      key: 'forceSignOut',
      icon: signedIn ?
          (<ApiTwoTone className={tableStyles.action}/>) :
          (<ApiTwoTone twoToneColor={COLORS.disabled}
                       className={tableStyles.action}/>)
    },
    dividerItem
  ];

  const deleteItems = [
    {
      label: (
          <Popconfirm placement={'topRight'}
                      disabled={true}
                      onConfirm={() => onDeleteUser(record)}
                      title={t(intl, 'msg.deleteConfirm', { instance: record.email })}>
            {t(intl, 'actions.delete')}
          </Popconfirm>
      ),
      key: 'delete',
      icon: <DeleteTwoTone className={tableStyles.action}
                           twoToneColor={COLORS.danger}/>
    }
  ];

  return [
    ...multipleItems,
    ...basicItems,
    ...currentItems,
    dividerItem,
    ...lockedItems,
    ...forceSignOut,
    ...deleteItems
  ];
};
