import React from 'react';
import { Menu, Popconfirm } from 'antd';
import { DeleteTwoTone, MessageTwoTone, NotificationTwoTone, PaperClipOutlined } from '@ant-design/icons';

import { NavLink, useIntl } from 'umi';

import { COLORS } from '@/utils/colors';

import tableStyles from '@/components/Main/Table/table.module.less';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
const BusinessUserMenu = props => {
  const intl = useIntl();
  const {
    ability,
    loading,
    record,
    currentUser,
    onUnassignUser,
    setVisibleMessage,
    onResendRegisterLink
  } = props;

  const { metadata } = record;
  const { pending } = metadata;

  return (
      <Menu>
        {pending ? (
            <Menu.Item key={'message'}
                       onClick={() => onResendRegisterLink(record)}
                       icon={<PaperClipOutlined className={tableStyles.action}
                                                twoToneColor={COLORS.warning}/>}>
              {intl.formatMessage({id: 'auth.reSendRegisterLink', defaultMessage: 'Re-Send Invitation'})}
            </Menu.Item>
        ) : (
            <>
              <Menu.Item key={'notifications'}
                         icon={<NotificationTwoTone className={tableStyles.action}
                                                    twoToneColor={COLORS.warning}/>}>
                <NavLink to={`/admin/users/${record.id}/notifications`}>
                  {intl.formatMessage({id: 'route.notifications', defaultMessage: 'Notifications'})}
                </NavLink>
              </Menu.Item>
              <Menu.Item key={'message'}
                         onClick={() => {
                           setVisibleMessage({ visible: true, props: { from: currentUser, to: record } });
                         }}
                         icon={<MessageTwoTone className={tableStyles.action}
                                               twoToneColor={COLORS.warning}/>}>
                {intl.formatMessage({id: 'auth.sendMessage', defaultMessage: 'Send Message'})}
              </Menu.Item>
            </>
        )}
        <Menu.Divider/>
        <Menu.Item key={'delete'}
                   icon={<DeleteTwoTone className={tableStyles.action}
                                        twoToneColor={COLORS.danger}/>}>
          <Popconfirm title={intl.formatMessage({id: 'msg:unassignConfirm', defaultMessage: 'Are you sure to unassign this {instance}?'},{ instance: record.email })}
                      placement={'topRight'}
                      onConfirm={() => onUnassignUser(record)}>
            {intl.formatMessage({id: 'actions:unassign', defaultMessage: 'Unassign'})}
          </Popconfirm>
        </Menu.Item>
      </Menu>
  );
};

export default BusinessUserMenu;
