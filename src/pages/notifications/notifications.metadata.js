import React from 'react';
import {Row, Col} from 'antd';
import {EyeTwoTone, MessageTwoTone} from '@ant-design/icons';

import styles from 'pages/notifications/notifications.module.less';

/**
 * @export
 * @param t
 * @param data
 * @param loading
 * @return {*}
 */
export const notificationsMetadata = ({
  t,
  loading
}) => ({
  width: '100%',
  size: 'middle',
  columns: [
    {
      title: t('table:name'),
      dataIndex: 'name',
      key: 'name',
      filterable: true,
      sortable: true
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
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: createdAt => {
        const date = new Date(createdAt);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      }
    }
  ],
  loading: loading.effects['notifications/query']
});

export const expendableNotification = props => {
  const {t} = props;

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
              <Col {...colProps}>
                <div>
                  <EyeTwoTone/>
                  <strong>{t('form:target')}</strong>
                </div>
                {record?.target}
              </Col>
            </Row>
          </div>
      );
    },
    rowExpandable: record => true
  };
};
