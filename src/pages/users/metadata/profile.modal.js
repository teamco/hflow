import React from 'react';
import { Col, Row, Tag } from 'antd';
import { CheckCircleTwoTone, LockTwoTone, UnlockTwoTone, WarningTwoTone } from '@ant-design/icons';

import { tsToLocaleDateTime } from '@/utils/timestamp';
import { COLORS } from '@/utils/colors';
import { BRANDS } from '@/utils/brands';
import { t } from '@/utils/i18n';

import { getRoleIcon } from '../[user]/profile/profile.metadata';

import styles from '../users.module.less';

/**
 * @export
 * @constant
 * @param record
 * @param modal
 * @param intl
 */
export const showProfileModal = (record, modal, intl) => {
  const { metadata } = record;
  const imgSpan = 8;

  return modal.info({
    title: false,
    icon: false,
    width: 500,
    okText: t(intl, 'actions.close'),
    okButtonProps: { size: 'small' },
    className: styles.profileInfo,
    content: (
        <Row className={styles.profile} gutter={[24, 24]}>
          {metadata.photoURL && (
              <Col span={imgSpan}>
                <img src={metadata.photoURL}
                     referrerPolicy={'no-referrer'}
                     alt={record.displayName}/>
              </Col>
          )}
          <Col span={metadata.photoURL ? 24 - imgSpan : 24}>
            <Row>
              <Col span={10}>{t(intl, 'table.name')}</Col>
              <Col span={14}>{record.displayName}</Col>
            </Row>
            <Row>
              <Col span={10}>{t(intl, 'auth.email')}</Col>
              <Col span={14}>{record.email || t(intl, 'error.na')}</Col>
            </Row>
            <Row>
              <Col span={10}>{t(intl, 'form.createdAt')}</Col>
              <Col span={14}>{tsToLocaleDateTime(+(new Date(metadata.creationTime)))}</Col>
            </Row>
            <Row>
              <Col span={10}>{t(intl, 'auth.lastSignInTime')}</Col>
              <Col span={14}>{tsToLocaleDateTime(+(new Date(metadata.lastSignInTime)))}</Col>
            </Row>
            <Row>
              <Col span={10}>{t(intl, 'auth.emailVerified')}</Col>
              <Col span={14}>
                {record.emailVerified ? (
                    <CheckCircleTwoTone twoToneColor={COLORS.success}/>
                ) : (
                    <WarningTwoTone twoToneColor={COLORS.warning}/>
                )}
              </Col>
            </Row>
            <Row>
              <Col span={10}>{t(intl, 'auth.provider')}</Col>
              <Col span={14}>
                <div className={styles.profileProvider}>
                  <Tag color={metadata.signedIn ? BRANDS[metadata.providerId]?.color : null}
                       icon={BRANDS[metadata.providerId]?.icon}
                       className={styles.rules}>
                    {metadata.providerId}
                  </Tag>
                  <div>{metadata.isLocked ? (<LockTwoTone/>) : (<UnlockTwoTone/>)}</div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={10}>{t(intl, 'auth.roles')}</Col>
              <Col span={14}>
                {record.roles.map((role, idx) => (
                    <Tag className={styles.rules}
                         style={{ marginBottom: 3 }}
                         key={`cr.${idx}`}
                         icon={getRoleIcon(role)}>
                      {role}
                    </Tag>
                ))}
              </Col>
            </Row>
          </Col>
        </Row>
    )
  });
};
