import React from 'react';
import { Link, useIntl } from '@umijs/max';
import { Avatar, Card, Row, Col, Divider } from 'antd';
import { t } from '@/utils/i18n';
import { isSpinning } from '@/utils/state';
import { API } from '@/services/config/api.config';
import styles from '@/pages/landing/profile/overview/profile.overview.module.less';

const MODEL_NAME = 'profileModel';

export const OverviewInfo = props => {
  const intl = useIntl();

  const {
    formRef,
    loading,
    isEdit,
    sProfile = {},
    disabled
  } = props;

  const emailsProps = {
    loading: isSpinning(loading, [`${MODEL_NAME}/getEmails`]),
    disabled
  };

  const emails = sProfile?.primaryEmail ? [sProfile?.primaryEmail] : [];

  const getUserProfileInfo = () => {
    console.log(sProfile, 'profile ----------------------------');
    const {description, name: {first, second, honorific} = {}} = sProfile;
    return (
        <div>
          <h3>{first} {second}</h3>
          <p>{description}</p>
        </div>
    )
  }

  const getUserProfileMails = () => {
    const {description, name: {first, second, honorific} = {}} = sProfile;
    return (
        <div>
          <h3>{first} {second}</h3>
          <p>{description}</p>
        </div>

    )
  }

  return (
            <Card className={styles.profileInfo}>
                <Row className={styles.infoBackground}>
                  <Col span={24}>
                    <Avatar
                        size={100}
                        src={API?.avatar}
                    />
                  </Col>
                </Row>
              <Divider type="vertical" />
                <Row gutter={[24, 16]} className={styles.infoDetails}>
                  <Col span={12} className={styles.infoDetails}>
                    {sProfile !== 'undefined' && getUserProfileInfo()}
                  </Col>
                  <Col span={12}>
                    here whould be you mail
                  </Col>
                </Row>
            </Card>
  );
};