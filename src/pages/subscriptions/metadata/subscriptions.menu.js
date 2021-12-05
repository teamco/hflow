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

import { COLORS } from 'utils/colors';

import tableStyles from 'components/Main/Table/table.module.less';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export const SubscriptionMenu = props => {
  const {
    t,
    ability,
    loading,
    record,
    onSignOutUser,
    onLockUser,
    onUnlockUser,
    onDeleteUser,
    setVisibleMessage
  } = props;

  const {
    isLocked,
    signedIn
  } = record.metaData;

  return (
      <Menu>
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

export default withTranslation()(SubscriptionMenu);
