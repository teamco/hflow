import React, { useEffect } from 'react';
import { isAdmin, isBusiness } from 'services/user.service';
import { NavLink } from 'umi';
import {
  ApiTwoTone,
  DeleteTwoTone,
  PauseCircleTwoTone,
  PlayCircleTwoTone,
  LockTwoTone,
  UnlockTwoTone,
  ContactsTwoTone,
  CheckCircleTwoTone,
  WarningTwoTone,
  ProfileTwoTone,
  TeamOutlined,
  BoldOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Modal, Popconfirm, Tooltip, Tag } from 'antd';
import classnames from 'classnames';
import { tsToLocaleDateTime } from 'utils/timestamp';

import styles from 'pages/users/users.module.less';
import tableStyles from 'components/Main/Table/table.module.less';

/**
 * @export
 * @param t
 * @param data
 * @param loading
 * @param many
 * @param currentUser
 * @param onDeleteUser
 * @param onSignOutUser
 * @param onUnlockUser
 * @param onLockUser
 * @return {*}
 */
export const metadata = ({
  t,
  data,
  loading,
  many,
  currentUser = {},
  onDeleteUser,
  onSignOutUser,
  onUnlockUser,
  onLockUser
}) => {

  useEffect(() => {
  }, []);

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
              <img src={data.metadata.photoURL}
                   referrerPolicy={'no-referrer'}
                   alt={name}
                   className={styles.gridImg} />
              <span className={currentUser?.uid === data.uid ? styles.currentUser : null}>
                {name}
              </span>
            </div>
          );
        },
        filterable: many,
        sortable: many
      },
      {
        title: t('auth:provider'),
        dataIndex: 'metadata',
        render: metadata => (
          <Tag color={metadata.signedIn ? 'cyan' : 'lightgrey'}
               className={styles.provider}>
            {metadata.providerId}
          </Tag>
        )
      },
      // {
      //   title: t('auth:email'),
      //   dataIndex: 'email',
      //   key: 'email',
      //   filterable: many,
      //   sortable: many
      // },
      {
        title: t('auth:lastSignInTime'),
        dataIndex: 'metadata',
        key: 'lastSignInTime',
        render: metadata => tsToLocaleDateTime(+(new Date(metadata.lastSignInTime)))
      },
      {
        title: t('table:action'),
        render: record =>
          data.length ? (
            <div className={styles.nowrap}>
              <Popconfirm title={t('msg:deleteConfirm', { instance: record.email })}
                          placement={'topRight'}
                          onConfirm={() => onDeleteUser(record)}>
                <Tooltip title={t('actions:delete')}>
                  <DeleteTwoTone className={tableStyles.action}
                                 twoToneColor='#eb2f96' />
                </Tooltip>
              </Popconfirm>
              {record.metadata.signedIn ? (
                <Popconfirm title={t('auth:signOutConfirm', { instance: record.email })}
                            placement={'topRight'}
                            onConfirm={() => onSignOutUser(record)}>
                  <Tooltip title={t('auth:forceSignOut')}>
                    <ApiTwoTone className={tableStyles.action} />
                  </Tooltip>
                </Popconfirm>
              ) : (
                <Tooltip title={t('auth:forceSignOut')}>
                  <ApiTwoTone twoToneColor={'#999999'}
                              className={tableStyles.action} />
                </Tooltip>
              )}
              {record.metadata.isLocked ? (
                <Popconfirm title={t('auth:unlockConfirm', { instance: record.email })}
                            placement={'topRight'}
                            onConfirm={() => onUnlockUser(record)}>
                  <Tooltip title={t('auth:unlock')}>
                    <LockTwoTone className={tableStyles.action} />
                  </Tooltip>
                </Popconfirm>
              ) : (
                <Tooltip title={t('auth:lock')}>
                  <UnlockTwoTone twoToneColor={'#eb2f96'}
                                 className={tableStyles.action}
                                 onClick={() => onLockUser(record)} />
                </Tooltip>
              )}
              <>
                <Tooltip title={t('auth:showProfile')}>
                  <ContactsTwoTone className={tableStyles.action}
                                   onClick={() => showProfileModal(t, record)}
                                   twoToneColor={'#52c41a'} />
                </Tooltip>
                {many && (
                  <Tooltip title={t('menu:userProfile')}>
                    <NavLink to={`/admin/users/${record.id}`}>
                      <ProfileTwoTone className={tableStyles.action}
                                      twoToneColor={'#52c41a'} />
                    </NavLink>
                  </Tooltip>
                )}
              </>
            </div>
          ) : null
      }
    ],
    loading: loading.effects['userModel/query']
  };
};

/**
 * @export
 * @constant
 * @param t
 * @param record
 */
export const showProfileModal = (t, record) => {
  const { metadata } = record;
  const businessRole = isBusiness(record);

  Modal.info({
    title: false,
    icon: false,
    width: 500,
    okText: t('actions:close'),
    okButtonProps: {
      size: 'small'
    },
    content: (
      <div className={styles.profile}>
        <img src={metadata.photoURL}
             referrerPolicy={'no-referrer'}
             alt={record.displayName} />
        <div style={{ flex: '40%' }}>
          <div><strong>{t('table:name')}</strong></div>
          <div><strong>{t('auth:email')}</strong></div>
          <div><strong>{t('form:createdAt')}</strong></div>
          <div><strong>{t('auth:lastSignInTime')}</strong></div>
          <div><strong>{t('auth:emailVerified')}</strong></div>
          <div style={{ marginTop: '20px' }}>
            <strong>{t('auth:provider')}</strong>
          </div>
          <div style={{ marginTop: '20px' }}>
            <strong>{t('auth:roles')}</strong>
          </div>
        </div>
        <div style={{ flex: '60%' }}>
          <div>{record.displayName}</div>
          <div>{record.email || t('error:na')}</div>
          <div>{tsToLocaleDateTime(+(new Date(metadata.creationTime)))}</div>
          <div>{tsToLocaleDateTime(+(new Date(metadata.lastSignInTime)))}</div>
          <div>
            {record.emailVerified ? (
              <CheckCircleTwoTone twoToneColor='#52c41a' />
            ) : (
              <WarningTwoTone twoToneColor='#FFCC00' />
            )}
          </div>
          <div style={{ marginTop: '18px' }}>
            <Tag color={metadata.signedIn ? 'green' : 'volcano'}
                 icon={metadata.isLocked ? (<LockTwoTone />) : (<UnlockTwoTone />)}>
              {metadata.providerId.toUpperCase()}
            </Tag>
          </div>
          <div style={{ marginTop: '16px' }}>
            <Tag className={styles.rules}
                 icon={
                   isAdmin(record.roles) ? (<TeamOutlined />) :
                     businessRole ? (<BoldOutlined />) :
                       (<UserOutlined />)}>
              {businessRole || (record.roles || [])[0] || 'consumer'}
            </Tag>
          </div>
        </div>
      </div>
    )
  });
};
