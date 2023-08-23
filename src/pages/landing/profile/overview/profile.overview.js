import React from 'react';
import { useIntl, useParams } from '@umijs/max';
import { Form, Row, Spin, Col, Divider } from 'antd';

import { isSpinning } from '@/utils/state';
import { effectHook } from '@/utils/hooks';

import { OverviewInfo } from '@/pages/landing/profile/overview/sections/overview.info';
import { Analytics } from '@/pages/landing/profile/overview/sections/analytics';

import styles from '@/pages/landing/profile/overview/profile.overview.module.less';
import Loader from '@/components/Loader';

const MODEL_NAME = 'profileModel';

export const ProfileOverview = props => {
  const [formRef] = Form.useForm();

  const {
    loading,
    profileModel,
    onQuery,
    onGetEmails,
    onGetLogos
  } = props;

  const params = useParams();
  const component = 'profile.overview';

  const {
    sProfile,
    sEmails
  } = profileModel;

  effectHook(() => {
    if (params && params.profileId) {
      onQuery(params.profileId);
    }
  }, [params]);

  effectHook(() => {
    if (sProfile) {
      onGetEmails();
    }
  }, [sProfile]);

  return (
      <div className={styles.profileOverview}>
        <Loader spinning={!params?.profileId} loading={loading} spinOn={[`${MODEL_NAME}/loadOpenProfile`]}>
          <Row className={styles.profileInfo}>
            <Col span={24}>
              {sProfile ? <OverviewInfo sProfile={sProfile}/> : null}
              <Divider type="vertical"/>
              {sProfile ? <Analytics sProfile={sProfile}/> : null}
            </Col>
          </Row>
        </Loader>
      </div>
  );
};