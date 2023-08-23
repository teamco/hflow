import React from 'react';
import { PauseCircleTwoTone, PlayCircleTwoTone, SyncOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Tag, Tooltip } from 'antd';
import classnames from 'classnames';

import DropdownButton from '@/components/Buttons/dropdown.button';

import { businessUserMenu } from '@/pages/users/[user]/businesses/[business]/users/metadata/business.user.menu';
import { getRoleIcon } from '@/pages/users/[user]/profile/profile.metadata';

import { tsToLocaleDateTime } from '@/utils/timestamp';
import { COLORS } from '@/utils/colors';
import { t } from '@/utils/i18n';

import styles from '@/pages/users/users.module.less';

/**
 * @export
 * @param props
 * @return {*}
 */
export const metadata = (props) => {
  const intl = useIntl();

  const {
    ability,
    currentUser,
    data,
    loading,
    multiple,
    disabled,
    setVisibleMessage,
    onAssignUser,
    onUnassignUser,
    onResendRegisterLink
  } = props;

  const menuProps = {
    intl,
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
        title: t(intl, 'table.name'),
        dataIndex: 'displayName',
        key: 'displayName',
        render(name, data) {
          const { pending, signedIn } = data?.metadata || {};
          const color = signedIn ? COLORS.success : COLORS.disabled;
          const signed = {
            title: t(intl, signedIn ? 'auth.signedIn' : 'auth.signedOut'),
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
                            {t(intl, 'auth.pending')}
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
        title: t(intl, 'auth.roles'),
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
        title: t(intl, 'auth.lastSignInTime'),
        dataIndex: 'metadata',
        key: 'lastSignInTime',
        render: metadata => metadata?.pending ? t(intl, 'error.na') :
            tsToLocaleDateTime(+(new Date(metadata.lastSignInTime)))
      },
      {
        title: t(intl, 'table.action'),
        fixed: 'right',
        width: 150,
        render: record => data.length ? (
            <div className={styles.nowrap}>
              <DropdownButton key={'manage'}
                              overlay={businessUserMenu({ record, ...menuProps })}
                              data-testid={'business-edit'}
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
