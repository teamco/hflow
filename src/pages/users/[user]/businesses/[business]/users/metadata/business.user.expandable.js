import React, { useState } from 'react';
import { Col, Row } from 'antd';
import { useIntl } from 'umi';
import { CalendarTwoTone, MailTwoTone } from '@ant-design/icons';
import { tsToLocaleDateTime } from '@/utils/timestamp';
import EmailVerified from '@/components/Profile/email.verified';

import styles from 'pages/users/users.module.less';

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
                  <strong>{intl.formatMessage({id: 'auth.email', defaultMessage: 'Email'})}</strong>
                </div>
                <div>{record.email || intl.formatMessage({id: 'error:na', defaultMessage: 'None'})}</div>
              </Col>
              {pending ? null : (
                  <Col span={8}>
                    <div>
                      <CalendarTwoTone/>
                      <strong>{intl.formatMessage({id: 'form.createdAt', defaultMessage: 'Created at'})}</strong>
                    </div>
                    <div>{tsToLocaleDateTime(+(new Date(creationTime)))}</div>
                  </Col>
              )}
              {pending ? (
                  <Col span={8}>
                    <div>
                      <CalendarTwoTone/>
                      <strong>{intl.formatMessage({id: 'form.invitedAt', defaultMessage: 'Invited at'})}</strong>
                    </div>
                    <div>
                      {tsToLocaleDateTime(invitedAt)}
                      {showSendInvitation && (
                          <div className={styles.verification}
                               onClick={() => {
                                 onResendRegisterLink(record);
                                 setShowSendInvitation(false);
                               }}>
                            {intl.formatMessage({id: 'auth.reSendRegisterLink', defaultMessage: 'Re-Send Invitation'})}
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
