import React from 'react';
import { Link, useIntl } from '@umijs/max';
import { Card, Row, Col, Divider } from 'antd';
import { t } from '@/utils/i18n';
import styles from '@/pages/landing/profile/overview/profile.overview.module.less';

export const Analytics = props => {
  const intl = useIntl();

  const {
    formRef,
    loading,
    sProfile = {},
    disabled
  } = props;

  return (
      <Card className={styles.profileCard}>
        <h3>Analytics</h3>
        <p>Private to you</p>
        <Row className={styles.profileAnalytics}>
          <Col span={8}>
            <h2>18 profiles views</h2>
            <p>Discover who is viewed your profile.</p>
          </Col>
          <Col span={8}>
            <h2>18 profiles views</h2>
            <p>Check out who is engaging with your posts.</p>
          </Col>
          <Col span={8}>
            <h2>25 search appearances</h2>
            <p>See how often you appear in search results.</p>
          </Col>
        </Row>
        <Divider type="vertical" />
      </Card>
  );
};