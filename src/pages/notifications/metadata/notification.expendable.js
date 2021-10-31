import React from 'react';
import {Col, Row} from 'antd';
import {MailTwoTone, MessageTwoTone} from '@ant-design/icons';

import styles from '../notifications.module.less';

/**
 * @export
 * @param props
 * @return {JSX.Element|{expandedRowRender(*): *, rowExpandable: (function(*): boolean)}}
 */
export const expendableNotification = props => {
  const {t, setVisibleMessage} = props;

  return {
    expandedRowRender(record) {
      const rowProps = {gutter: {xs: 8, sm: 16, md: 24, lg: 32}};
      const colProps = {sm: 12, md: 8, style: {marginTop: 10}};

      return (
          <div className={styles.notificationsInfo}>
            <Row {...rowProps}>
              <Col {...colProps}>
                <div>
                  <MessageTwoTone/>
                  <strong>{t('form:description')}</strong>
                </div>
                {record?.description}
              </Col>
              {record?.replyedTo && (
                  <Col {...colProps}>
                    <div>
                      <MessageTwoTone/>
                      <strong>{t('status:answered')}</strong>
                    </div>
                    {record?.replyedTo?.title}
                  </Col>
              )}
            </Row>
            <Row {...rowProps}>
              {record?.sentFrom && (
                  <Col {...colProps}>
                    <div>
                      <MailTwoTone/>
                      <strong>{t('notifications:from')}</strong>
                    </div>
                    <div className={styles.reply}
                         onClick={() => {
                           setVisibleMessage({
                             visible: true,
                             props: {
                               replyTo: {id: record?.id},
                               from: {email: record?.sentTo},
                               to: record?.sentFrom
                             }
                           });
                         }}>
                      {t('notifications:re', {sender: record?.sentFrom?.email})}
                    </div>
                  </Col>
              )}
              <Col {...colProps}>
                <div>
                  <MailTwoTone/>
                  <strong>{t('notifications:to')}</strong>
                </div>
                {record?.sentTo}
              </Col>
            </Row>
          </div>
      );
    },
    rowExpandable: record => true
  };
};
