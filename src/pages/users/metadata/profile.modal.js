import React from 'react';
import {Modal, Tag} from 'antd';
import {CheckCircleTwoTone, LockTwoTone, UnlockTwoTone, WarningTwoTone} from '@ant-design/icons';

import {tsToLocaleDateTime} from 'utils/timestamp';
import {COLORS} from 'utils/colors';
import {BRANDS} from 'utils/brands';
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
                  <CheckCircleTwoTone twoToneColor={COLORS.success}/>
              ) : (
                  <WarningTwoTone twoToneColor={COLORS.warning}/>
              )}
            </div>
            <div className={styles.profileProvider}>
              <Tag color={metadata.signedIn ? BRANDS[metadata.providerId]?.color : null}
                   icon={BRANDS[metadata.providerId]?.icon} className={styles.rules}>
                {metadata.providerId}
              </Tag>
              <div>{metadata.isLocked ? (<LockTwoTone/>) : (<UnlockTwoTone/>)}</div>
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
