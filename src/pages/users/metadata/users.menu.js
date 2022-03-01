import React from 'react';
import { Menu, Popconfirm } from 'antd';
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

import { NavLink, useIntl } from 'umi';

import { COLORS } from '@/utils/colors';

import tableStyles from '@/components/Main/Table/table.module.less';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export const UserMenu = props => {
  const intl = useIntl();
  const {
    ability,
    loading,
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

  return (
      <Menu>
        {multiple && (
            <Menu.Item key={'profile'}
                       icon={<ProfileTwoTone className={tableStyles.action}
                                             twoToneColor={COLORS.success}/>}>
              <NavLink to={`/admin/users/${record.id}`}>
                {intl.formatMessage({id: 'menu.userProfile', defaultMessage: 'User Profile'})}
              </NavLink>
            </Menu.Item>
        )}
        <Menu.Item key={'businesses'}
                   icon={<TrademarkCircleTwoTone className={tableStyles.action}
                                                 twoToneColor={COLORS.success}/>}>
          <NavLink to={`/admin/users/${record.id}/businesses`}>
            {intl.formatMessage({id: 'route.businesses', defaultMessage: 'Business'})}
          </NavLink>
        </Menu.Item>
        <Menu.Divider/>
        <Menu.Item key={'notifications'}
                   icon={<NotificationTwoTone className={tableStyles.action}
                                              twoToneColor={COLORS.warning}/>}>
          <NavLink to={`/admin/users/${record.id}/notifications`}>
            {intl.formatMessage({id: 'route.notifications', defaultMessage: 'Notifications'})}
          </NavLink>
        </Menu.Item>
        {(currentUser?.uid !== record.uid) && (
            <Menu.Item key={'message'}
                       onClick={() => {
                         setVisibleMessage({ visible: true, props: { from: currentUser, to: record } });
                       }}
                       icon={<MessageTwoTone className={tableStyles.action}
                                             twoToneColor={COLORS.warning}/>}>
              {intl.formatMessage({id: 'auth.sendMessage', defaultMessage: 'Send Message'})}
            </Menu.Item>
        )}
        <Menu.Divider/>
        <Menu.Item key={'lock'}
                   icon={isLocked ?
                       (<LockTwoTone className={tableStyles.action}/>) :
                       (<UnlockTwoTone twoToneColor={COLORS.danger}
                                       className={tableStyles.action}/>)
                   }>
          {isLocked ? (
              <Popconfirm title={intl.formatMessage({id: 'auth.unlockConfirm', defaultMessage: 'Are you sure to unlock user {instance}?'}, { instance: record.email })}
                          placement={'topRight'}
                          onConfirm={() => onUnlockUser(record)}>
                {intl.formatMessage({id: 'auth.unlock', defaultMessage: 'Unlock'})}
              </Popconfirm>
          ) : (
              <div onClick={() => onLockUser(record)}>
                {intl.formatMessage({id: 'auth.lock', defaultMessage: 'Lock'})}
              </div>
          )}
        </Menu.Item>
        <Menu.Item key={'forceSignOut'}
                   icon={signedIn ? (
                       <ApiTwoTone className={tableStyles.action}/>
                   ) : (
                       <ApiTwoTone twoToneColor={COLORS.disabled}
                                   className={tableStyles.action}/>
                   )}>
          {signedIn ? (
              <Popconfirm title={intl.formatMessage({id: 'auth.signOutConfirm', defaultMessage: 'Are you sure to sign out user {instance}?'}, { instance: record.email })}
                          placement={'topRight'}
                          onConfirm={() => onSignOutUser(record)}>
                {intl.formatMessage({id: 'auth.forceSignOut', defaultMessage: 'Force SignOut'})}
              </Popconfirm>
          ) : intl.formatMessage({id: 'auth.forceSignOut', defaultMessage: 'Force SignOut'})
          }
        </Menu.Item>
        <Menu.Divider/>
        <Menu.Item key={'delete'}
                   icon={<DeleteTwoTone className={tableStyles.action}
                                        twoToneColor={COLORS.danger}/>}>
          <Popconfirm title={intl.formatMessage({id: 'msg:deleteConfirm', defaultMessage: 'Are you sure to delete this {instance}?'}, { instance: record.email })}
                      placement={'topRight'}
                      onConfirm={() => onDeleteUser(record)}>
            {intl.formatMessage({id: 'actions.delete', defaultMessage: 'Delete'})}
          </Popconfirm>
        </Menu.Item>
      </Menu>
  );
};

export default UserMenu;
