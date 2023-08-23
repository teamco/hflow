import React from 'react';
import { useIntl } from '@umijs/max';
import { Avatar, Col, Row, Tooltip } from 'antd';

import { effectHook } from '@/utils/hooks';
import { t } from '@/utils/i18n';
import { tsToLocaleDateTime } from '@/utils/timestamp';

import EmailVerified from '@/components/Profile/email.verified';
import Loader from '@/components/Loader';

import { API } from '@/services/config/api.config';

import styles from './profile.account.module.less';

const MODEL_NAME = 'profileModel';

export const ProfileAccount = props => {
  const intl = useIntl();

  const {
    loading,
    authModel,
    userModel,
    onQuery,
    onSendVerification
  } = props;

  const { user } = authModel;
  const { verificationSent } = userModel;

  const component = 'profile.account';

  effectHook(() => {
    user && onQuery();
  }, [user]);

  return (
      <div className={styles.profileForm}>
        <Loader loading={loading} spinOn={[`${MODEL_NAME}/query`]}>
          <Row gutter={[42, 42]}>
            <Col span={6}>
              {user?.metadata?.photoURL ? (
                  <img src={user?.metadata?.photoURL}
                       alt={user?.displayName}
                       referrerPolicy={'no-referrer'}/>
              ) : (
                  <Avatar src={API.avatar} className={styles.noLogo}/>
              )}
            </Col>
            <Col span={18}>
              <h1>
                {user?.displayName}
                <Row>
                  <Col span={5}>{t(intl, 'auth.email')}</Col>
                  <Col>
                    <Tooltip title={user?.email}>
                      <span>
                        <EmailVerified data={user}
                                       className={styles.emailVerified}
                                       verification={{
                                         component,
                                         verificationSent,
                                         onSendVerification
                                       }}/>
                      </span>
                    </Tooltip>
                  </Col>
                </Row>
                <Row>
                  <Col span={5}>{t(intl, 'auth.provider')}</Col>
                  <Col>{user?.metadata?.providerId}</Col>
                </Row>
                <Row>
                  <Col span={5}>{t(intl, 'auth.lastSignInTime')}</Col>
                  <Col>{tsToLocaleDateTime(+(new Date(user?.metadata?.lastSignInTime)))}</Col>
                </Row>
              </h1>
            </Col>
          </Row>
        </Loader>
      </div>
  );
};