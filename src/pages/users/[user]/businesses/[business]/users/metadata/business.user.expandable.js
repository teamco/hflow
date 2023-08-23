import React, { useState } from 'react';
import { Col, Row } from 'antd';
import { useIntl } from '@umijs/max';
import { CalendarTwoTone, MailTwoTone } from '@ant-design/icons';
import { tsToLocaleDateTime } from '@/utils/timestamp';
import EmailVerified from '@/components/Profile/email.verified';

import styles from '@/pages/users/users.module.less';
import { t } from '@/utils/i18n';

/**
 * @export
 * @param props
 * @return {{expandedRowRender, rowExpandable}}
 */
export const expandable = (props) => {
  const {
    component,
    verificationSent,
    businessRoles,
    onUpdateRole,
    onSendVerification,
    onResendRegisterLink
  } = props;

  const intl = useIntl();

  const [showSendInvitation, setShowSendInvitation] = useState(true);

  return {
    expandedRowRender(record) {
      const { business = {}, metadata = {} } = record;
      const { userRoles } = business;
      const { pending, invitedAt, creationTime } = metadata;

      return (
          <div className={styles.profileExpand}>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <div>
                  <MailTwoTone/>
                  <strong>{t(intl, 'auth.email')}</strong>
                </div>
                <div>{record.email || t(intl, 'error.na')}</div>
              </Col>
              {pending ? null : (
                  <Col span={8}>
                    <div>
                      <CalendarTwoTone/>
                      <strong>{t(intl, 'form.createdAt')}</strong>
                    </div>
                    <div>{tsToLocaleDateTime(+(new Date(creationTime)))}</div>
                  </Col>
              )}
              {pending ? (
                  <Col span={8}>
                    <div>
                      <CalendarTwoTone/>
                      <strong>{t(intl, 'form.invitedAt')}</strong>
                    </div>
                    <div>
                      {tsToLocaleDateTime(invitedAt)}
                      {showSendInvitation && (
                          <div className={styles.verification}
                               onClick={() => {
                                 onResendRegisterLink(record, intl);
                                 setShowSendInvitation(false);
                               }}>
                            {t(intl, 'auth.reSendRegisterLink')}
                          </div>
                      )}
                    </div>
                  </Col>
              ) : null}
            </Row>
            {pending ? null : (
                <Row gutter={[16, 16]}
                     style={{ marginTop: 10 }}>
                  <Col span={8}>
                    <EmailVerified data={record}
                                   verification={{
                                     component,
                                     verificationSent,
                                     onSendVerification
                                   }}/>
                  </Col>
                </Row>
            )}
          </div>
      );
    },
    rowExpandable: record => true
  };
};
