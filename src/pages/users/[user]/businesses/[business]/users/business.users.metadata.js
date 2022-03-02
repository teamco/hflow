import React from 'react';
import { DownOutlined, PauseCircleTwoTone, PlayCircleTwoTone, SettingOutlined, SyncOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';
import { Button, Dropdown, Tag, Tooltip } from 'antd';

import classnames from 'classnames';
import { tsToLocaleDateTime } from '@/utils/timestamp';
import BusinessUserMenu from './metadata/business.user.menu';

import { getRoleIcon } from 'pages/users/[user]/profile/profile.metadata';
import { COLORS } from '@/utils/colors';

import styles from 'pages/users/users.module.less';
import menuStyles from '@/components/menu.less';

/**
 * @export
 * @param t
 * @param data
 * @param ability
 * @param currentUser
 * @param setVisibleMessage
 * @param loading
 * @param multiple
 * @param onAssignUser
 * @param onUnassignUser
 * @param onResendRegisterLink
 * @return {*}
 */
export const metadata = ({
  ability,
  currentUser,
  data,
  loading,
  multiple,
  setVisibleMessage,
  onAssignUser,
  onUnassignUser,
  onResendRegisterLink
}) => {
  const intl = useIntl();
  const menuProps = {
    ability,
    loading,
    currentUser,
    onUnassignUser,
    setVisibleMessage,
    onResendRegisterLink
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
          const { pending, signedIn } = data?.metadata || {};
          const color = signedIn ? COLORS.success : COLORS.disabled;
          const signed = {
            title: intl.formatMessage({id: signedIn ? 'auth.signedIn' : 'auth.signedOut', defaultMessage: signedIn ? 'Signed in' : 'Sign out'}),
            icon: signedIn ?
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
                <span>
                  {pending ? (
                          <Tag icon={<SyncOutlined spin/>}
                               color={COLORS.tags.processing}>
                            {intl.formatMessage({id: 'auth.pending', defaultMessage: 'Pending'})}
                          </Tag>
                      ) :
                      name}
                </span>
              </div>
          );
        },
        filterable: multiple,
        sortable: multiple
      },
      {
        title: intl.formatMessage({id: 'auth.roles', defaultMessage: 'Roles'}),
        dataIndex: ['userRoles'],
        key: 'roles',
        render(name, data) {
          const roles = data?.roles || data?.userRoles;
          return (
              <div>
                {roles?.map((role, idx) => (
                    <Tag className={styles.rules}
                         style={{ marginBottom: 3 }}
                         key={`cr.${idx}`}
                         closable={false}
                         icon={getRoleIcon(role)}>
                      {role}
                    </Tag>
                ))}
              </div>
          );
        }
      },
      {
        title: intl.formatMessage({id: 'auth.lastSignInTime', defaultMessage: 'Last Sign In'}),
        dataIndex: 'metadata',
        key: 'lastSignInTime',
        render: metadata => metadata?.pending ? intl.formatMessage({id: 'error.na', defaultMessage: 'None'}) :
            tsToLocaleDateTime(+(new Date(metadata.lastSignInTime)))
      },
      {
        title: intl.formatMessage({id: 'table.action', defaultMessage: 'Action'}),
        fixed: 'right',
        width: 150,
        render: record => data.length ? (
            <div className={styles.nowrap}>
              <Dropdown overlay={<BusinessUserMenu record={record} {...menuProps} />}
                        overlayClassName={menuStyles.customActionMenu}
                        key={'custom'}>
                <Button size={'small'}
                        icon={<SettingOutlined/>}
                        className={menuStyles.customAction}>
                  {intl.formatMessage({id: 'user.actions.manage', defaultMessage: 'Manage User' })} <DownOutlined/>
                </Button>
              </Dropdown>
            </div>
        ) : null
      }
    ],
    loading: loading.effects['userModel/query']
  };
};
