import React from 'react';
import { withTranslation } from 'react-i18next';
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

import { NavLink } from 'umi';

import { COLORS } from '@/utils/colors';

import tableStyles from '@/components/Main/Table/table.module.less';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export const UserMenu = props => {
  const {
    t,
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
                {t('menu:userProfile')}
              </NavLink>
            </Menu.Item>
        )}
        <Menu.Item key={'businesses'}
                   icon={<TrademarkCircleTwoTone className={tableStyles.action}
                                                 twoToneColor={COLORS.success}/>}>
          <NavLink to={`/admin/users/${record.id}/businesses`}>
            {t('route:businesses')}
          </NavLink>
        </Menu.Item>
        <Menu.Divider/>
        <Menu.Item key={'notifications'}
                   icon={<NotificationTwoTone className={tableStyles.action}
                                              twoToneColor={COLORS.warning}/>}>
          <NavLink to={`/admin/users/${record.id}/notifications`}>
            {t('route:notifications')}
          </NavLink>
        </Menu.Item>
        {(currentUser?.uid !== record.uid) && (
            <Menu.Item key={'message'}
                       onClick={() => {
                         setVisibleMessage({ visible: true, props: { from: currentUser, to: record } });
                       }}
                       icon={<MessageTwoTone className={tableStyles.action}
                                             twoToneColor={COLORS.warning}/>}>
              {t('auth:sendMessage')}
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
              <Popconfirm title={t('auth:unlockConfirm', { instance: record.email })}
                          placement={'topRight'}
                          onConfirm={() => onUnlockUser(record)}>
                {t('auth:unlock')}
              </Popconfirm>
          ) : (
              <div onClick={() => onLockUser(record)}>
                {t('auth:lock')}
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
              <Popconfirm title={t('auth:signOutConfirm', { instance: record.email })}
                          placement={'topRight'}
                          onConfirm={() => onSignOutUser(record)}>
                {t('auth:forceSignOut')}
              </Popconfirm>
          ) : t('auth:forceSignOut')
          }
        </Menu.Item>
        <Menu.Divider/>
        <Menu.Item key={'delete'}
                   icon={<DeleteTwoTone className={tableStyles.action}
                                        twoToneColor={COLORS.danger}/>}>
          <Popconfirm title={t('msg:deleteConfirm', { instance: record.email })}
                      placement={'topRight'}
                      onConfirm={() => onDeleteUser(record)}>
            {t('actions:delete')}
          </Popconfirm>
        </Menu.Item>
      </Menu>
  );
};

export default withTranslation()(UserMenu);
