import React, {useEffect} from 'react';
import {NavLink} from 'umi';
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
  MehTwoTone,
  SettingOutlined,
  DownOutlined,
  TrademarkCircleTwoTone
} from '@ant-design/icons';

import {Modal, Popconfirm, Tooltip, Tag, Menu, Button, Dropdown} from 'antd';
import classnames from 'classnames';
import {tsToLocaleDateTime} from 'utils/timestamp';

import {getRoleIcon} from 'pages/users/[user]/profile/profile.metadata';

import styles from 'pages/users/users.module.less';
import tableStyles from 'components/Main/Table/table.module.less';

const menu = props => {
  const {
    t,
    ability,
    loading,
    record,
    rowEnabled,
    multiple,
    onSignOutUser,
    onLockUser,
    onUnlockUser,
    onDeleteUser
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
                                             twoToneColor={'#52c41a'}/>}>
              <NavLink to={`/admin/users/${record.id}`}>
                {t('menu:userProfile')}
              </NavLink>
            </Menu.Item>
        )}
        <Menu.Item key={'businesses'}
                   icon={<TrademarkCircleTwoTone className={tableStyles.action}
                                                 twoToneColor={'#52c41a'}/>}>
          <NavLink to={`/admin/users/${record.id}/businesses`}>
            {t('route:businesses')}
          </NavLink>
        </Menu.Item>
        <Menu.Item key={'lock'}
                   icon={isLocked ?
                       (<LockTwoTone className={tableStyles.action}/>) :
                       (<UnlockTwoTone twoToneColor={'#eb2f96'}
                                       className={tableStyles.action}/>)
                   }>
          {isLocked ? (
              <Popconfirm title={t('auth:unlockConfirm', {instance: record.email})}
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
                       <ApiTwoTone twoToneColor={'#999999'}
                                   className={tableStyles.action}/>
                   )}>
          {signedIn ? (
              <Popconfirm title={t('auth:signOutConfirm', {instance: record.email})}
                          placement={'topRight'}
                          onConfirm={() => onSignOutUser(record)}>
                {t('auth:forceSignOut')}
              </Popconfirm>
          ) : t('auth:forceSignOut')
          }
        </Menu.Item>
        <Menu.Item key={'delete'}
                   danger
                   icon={<DeleteTwoTone className={tableStyles.action}
                                        twoToneColor="#eb2f96"/>}>
          <Popconfirm title={t('msg:deleteConfirm', {instance: record.email})}
                      placement={'topRight'}
                      onConfirm={() => onDeleteUser(record)}>
            {t('actions:delete')}
          </Popconfirm>
        </Menu.Item>
      </Menu>
  );
};

/**
 * @export
 * @param t
 * @param ability
 * @param data
 * @param loading
 * @param multiple
 * @param rowEnabled
 * @param currentUser
 * @param onDeleteUser
 * @param onSignOutUser
 * @param onUnlockUser
 * @param onLockUser
 * @return {*}
 */
export const metadata = ({
  t,
  ability,
  data,
  loading,
  multiple,
  rowEnabled,
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
                {data.metadata.photoURL ? (
                    <img src={data.metadata.photoURL}
                         referrerPolicy={'no-referrer'}
                         alt={name}
                         className={styles.gridImg}/>
                ) : (<MehTwoTone style={{marginRight: 10, width: 20}}/>)}
                <NavLink to={`/admin/users/${data.id}`}>
                  <span className={currentUser?.uid === data.uid ? styles.currentUser : null}>
                    {name}
                  </span>
                </NavLink>
              </div>
          );
        },
        filterable: multiple,
        sortable: multiple
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
      //   filterable: multiple,
      //   sortable: multiple
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
                  <Tooltip title={t('auth:showProfile')}>
                    <ContactsTwoTone className={tableStyles.action}
                                     onClick={() => showProfileModal(t, record)}
                                     twoToneColor={'#52c41a'}/>
                  </Tooltip>
                  <Dropdown overlay={menu({
                    t,
                    loading,
                    ability,
                    record,
                    rowEnabled,
                    multiple,
                    onSignOutUser,
                    onLockUser,
                    onUnlockUser,
                    onDeleteUser
                  })}
                            disabled={record.key !== rowEnabled}
                            overlayClassName={styles.customActionMenu}
                            key={'custom'}>
                    <Button size={'small'}
                            icon={<SettingOutlined/>}
                            className={styles.customAction}>
                      {t('actions:manage', {type: t('auth:user')})} <DownOutlined/>
                    </Button>
                  </Dropdown>
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
  const {metadata} = record;

  Modal.info({
    title: false,
    icon: false,
    width: 500,
    okText: t('actions:close'),
    okButtonProps: {size: 'small'},
    content: (
        <div className={styles.profile}>
          {metadata.photoURL && (
              <img src={metadata.photoURL}
                   referrerPolicy={'no-referrer'}
                   alt={record.displayName}/>
          )}
          <div style={{flex: '40%'}}>
            <div><strong>{t('table:name')}</strong></div>
            <div><strong>{t('auth:email')}</strong></div>
            <div><strong>{t('form:createdAt')}</strong></div>
            <div><strong>{t('auth:lastSignInTime')}</strong></div>
            <div><strong>{t('auth:emailVerified')}</strong></div>
            <div style={{marginTop: '20px'}}>
              <strong>{t('auth:provider')}</strong>
            </div>
            <div style={{marginTop: '20px'}}>
              <strong>{t('auth:roles')}</strong>
            </div>
          </div>
          <div style={{flex: '60%'}}>
            <div>{record.displayName}</div>
            <div>{record.email || t('error:na')}</div>
            <div>{tsToLocaleDateTime(+(new Date(metadata.creationTime)))}</div>
            <div>{tsToLocaleDateTime(+(new Date(metadata.lastSignInTime)))}</div>
            <div>
              {record.emailVerified ? (
                  <CheckCircleTwoTone twoToneColor="#52c41a"/>
              ) : (
                  <WarningTwoTone twoToneColor="#FFCC00"/>
              )}
            </div>
            <div style={{marginTop: '18px'}}>
              <Tag className={styles.rules}
                   color={metadata.signedIn ? 'green' : 'volcano'}
                   icon={metadata.isLocked ? (<LockTwoTone/>) : (<UnlockTwoTone/>)}>
                {metadata.providerId}
              </Tag>
            </div>
            <div style={{marginTop: '16px'}}>
              {record.roles.map((role, idx) => (
                  <Tag className={styles.rules}
                       style={{marginBottom: 3}}
                       key={`cr.${idx}`}
                       icon={getRoleIcon(role)}>
                    {role}
                  </Tag>
              ))}
            </div>
          </div>
        </div>
    )
  });
};
