import React from 'react';
import {Row, Col} from 'antd';
import {MailTwoTone, MessageTwoTone, RetweetOutlined} from '@ant-design/icons';

import styles from 'pages/notifications/notifications.module.less';

/**
 * @export
 * @param t
 * @param loading
 * @return {*}
 */
export const notificationsMetadata = ({t, loading}) => ({
  width: '100%',
  size: 'middle',
  columns: [
    {
      title: t('notifications:type'),
      dataIndex: 'type',
      key: 'type',
      filterable: true,
      sortable: true
    },
    {
      title: t('table:title'),
      dataIndex: 'title',
      key: 'title',
      filterable: true,
      sortable: true,
      render(title, record) {
        return record.read ? title : (<strong>{title}</strong>);
      }
    },
    {
      title: t('notifications:status'),
      dataIndex: 'status',
      key: 'status',
      filterable: true,
      sortable: true
    },
    {
      title: t('form:createdAt'),
      dataIndex: 'metadata',
      key: 'metadata',
      render(metadata) {
        const date = new Date(metadata.createdAt);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      }
    }
  ],
  loading: loading.effects['notifications/query']
});

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
                      {record?.sentFrom?.email}
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
