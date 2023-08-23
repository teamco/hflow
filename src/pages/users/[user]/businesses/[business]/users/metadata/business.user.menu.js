import React from 'react';
import { Popconfirm } from 'antd';
import {
  DeleteTwoTone,
  MessageTwoTone,
  NotificationTwoTone,
  PaperClipOutlined
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
export const businessUserMenu = props => {
  const {
    ability,
    loading,
    intl,
    record,
    currentUser,
    onUnassignUser,
    setVisibleMessage,
    onResendRegisterLink
  } = props;

  const { metadata } = record;
  const { pending } = metadata;

  const dividerItem = { type: 'divider' };

  const pendingItems = pending ? [
    {
      label: (
          <div onClick={() => onResendRegisterLink(record, intl)}>
            {t(intl, 'auth.reSendRegisterLink')}
          </div>
      ),
      key: 'message',
      icon: <PaperClipOutlined className={tableStyles.action}
                               twoToneColor={COLORS.warning}/>
    }
  ] : [
    {
      label: (
          <NavLink to={`/admin/users/${record?.id}/notifications`}>
            {t(intl, 'route.notifications')}
          </NavLink>
      ),
      key: 'notifications',
      icon: <NotificationTwoTone className={tableStyles.action}
                                 twoToneColor={COLORS.warning}/>
    },
    {
      label: (
          <div onClick={() => setVisibleMessage({ visible: true, props: { from: currentUser, to: record } })}>
            {t(intl, 'auth.sendMessage')}
          </div>
      ),
      key: 'message',
      icon: <MessageTwoTone className={tableStyles.action}
                            twoToneColor={COLORS.warning}/>
    }
  ];

  const deleteItems = [
    {
      label: (
          <Popconfirm title={t(intl, 'msg.unassignConfirm', { instance: record.email })}
                      placement={'topRight'}
                      disabled={true}
                      onConfirm={() => onUnassignUser(record)}>
            {t(intl, 'actions.unassigned')}
          </Popconfirm>
      ),
      key: 'delete',
      icon: <DeleteTwoTone className={tableStyles.action}
                           twoToneColor={COLORS.danger}/>
    }
  ];

  return [
    ...pendingItems,
    dividerItem,
    ...deleteItems
  ];
};