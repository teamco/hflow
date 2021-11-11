import React from 'react';
import { withTranslation } from 'react-i18next';
import { Menu, Popconfirm } from 'antd';
import { DeleteTwoTone, MessageTwoTone, NotificationTwoTone, PaperClipOutlined } from '@ant-design/icons';

import { NavLink } from 'umi';

import { COLORS } from 'utils/colors';

import tableStyles from 'components/Main/Table/table.module.less';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
const BusinessUserMenu = props => {
  const {
    t,
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
              {t('auth:reSendRegisterLink')}
            </Menu.Item>
        ) : (
            <>
              <Menu.Item key={'notifications'}
                         icon={<NotificationTwoTone className={tableStyles.action}
                                                    twoToneColor={COLORS.warning}/>}>
                <NavLink to={`/admin/users/${record.id}/notifications`}>
                  {t('route:notifications')}
                </NavLink>
              </Menu.Item>
              <Menu.Item key={'message'}
                         onClick={() => {
                           setVisibleMessage({ visible: true, props: { from: currentUser, to: record } });
                         }}
                         icon={<MessageTwoTone className={tableStyles.action}
                                               twoToneColor={COLORS.warning}/>}>
                {t('auth:sendMessage')}
              </Menu.Item>
            </>
        )}
        <Menu.Divider/>
        <Menu.Item key={'delete'}
                   icon={<DeleteTwoTone className={tableStyles.action}
                                        twoToneColor={COLORS.danger}/>}>
          <Popconfirm title={t('msg:unassignConfirm', { instance: record.email })}
                      placement={'topRight'}
                      onConfirm={() => onUnassignUser(record)}>
            {t('actions:unassign')}
          </Popconfirm>
        </Menu.Item>
      </Menu>
  );
};

export default withTranslation()(BusinessUserMenu);
