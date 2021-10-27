import React from 'react';
import {Modal, Tag} from 'antd';
import {CheckCircleTwoTone, LockTwoTone, UnlockTwoTone, WarningTwoTone} from '@ant-design/icons';

import {tsToLocaleDateTime} from 'utils/timestamp';
import {getRoleIcon} from 'pages/users/[user]/profile/profile.metadata';

import styles from '../users.module.less';

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
