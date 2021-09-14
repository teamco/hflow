import React from 'react';
import {
  DeleteTwoTone,
  PauseCircleTwoTone,
  PlayCircleTwoTone,
  SettingOutlined,
  DownOutlined
} from '@ant-design/icons';
import { Button, Dropdown, Menu, Popconfirm, Tooltip } from 'antd';
import classnames from 'classnames';
import styles from 'pages/users/users.module.less';
import tableStyles from 'components/Main/Table/table.module.less';
import { tsToLocaleDateTime } from 'utils/timestamp';

/**
 * @export
 * @param t
 * @param data
 * @param loading
 * @param many
 * @param onAssignUser
 * @param onUnassignUser
 * @return {*}
 */
export const metadata = ({
  t,
  data,
  loading,
  many,
  onAssignUser,
  onUnassignUser
}) => {

  const menu = (record) => (
    <Menu>
      <Menu.Item key={'delete'}
                 icon={<DeleteTwoTone className={tableStyles.action}
                                      twoToneColor='#eb2f96' />}>
        <Popconfirm title={t('msg:unassignConfirm', { instance: record.email })}
                    placement={'topRight'}
                    onConfirm={() => onUnassignUser(record)}>
          {t('actions:unassign')}
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

  return {
    width: '100%',
    size: 'middle',
    columns: [
      {
        title: t('table:name'),
        dataIndex: 'displayName',
        key: 'displayName',
        render(name, data) {
          const isSignedIn = data.metadata.signedIn;
          const color = isSignedIn ? '#52c41a' : '#999999';
          const signed = {
            title: t(isSignedIn ? 'auth:signedIn' : 'auth:signedOut'),
            icon: isSignedIn ?
              (<PlayCircleTwoTone twoToneColor={color} />) :
              (<PauseCircleTwoTone twoToneColor={color} />)
          };

          return (
            <div className={styles.nowrap}>
              <Tooltip title={signed.title}>
                <span className={classnames(styles.signed)}>
                  {signed.icon}
                </span>
              </Tooltip>
              <span>{name}</span>
            </div>
          );
        },
        filterable: many,
        sortable: many
      },
      {
        title: t('auth:roles'),
        dataIndex: ['business', 'userRoles'],
        key: 'roles'
      },
      {
        title: t('auth:lastSignInTime'),
        dataIndex: 'metadata',
        key: 'lastSignInTime',
        render: metadata => tsToLocaleDateTime(+(new Date(metadata.lastSignInTime)))
      },
      {
        title: t('table:action'),
        render: record => data.length ? (
          <div className={styles.nowrap}>
            <Dropdown overlay={menu(record)}
                      overlayClassName={styles.customActionMenu}
                      key={'custom'}>
              <Button size={'small'}
                      icon={<SettingOutlined />}
                      className={styles.customAction}>
                {t('actions:manage', { type: t('menu:users') })} <DownOutlined />
              </Button>
            </Dropdown>
          </div>
        ) : null
      }
    ],
    loading: loading.effects['userModel/query']
  };
};