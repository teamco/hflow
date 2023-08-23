import React from 'react';
import { useIntl } from '@umijs/max';
import { Row } from 'antd';

import { effectHook } from '@/utils/hooks';
import { componentAbilities } from '@/utils/auth/component.setting';

import Loader from '@/components/Loader';

import { SubscriptionsColumnize } from '@/pages/landing/profile/subscriptions/subscription.columnize';

import styles from './profile.subscriptions.module.less';

const MODEL_NAME = 'profileModel';

export const ProfileSubscriptions = props => {
  const intl = useIntl();

  const {
    loading,
    authModel,
    profileModel,
    subscriptionModel,
    onQuery,
    onGetProfileSubscriptions
  } = props;

  const { user } = authModel;
  const { colorsToType } = subscriptionModel;

  const component = 'profile.subscriptions';

  const {
    sProfile,
    assignedSubscriptions = []
  } = profileModel;

  const { disabled } = componentAbilities(authModel, component, false);

  effectHook(() => {
    user && onQuery();
  }, [user]);

  effectHook(() => {
    sProfile && onGetProfileSubscriptions();
  }, [sProfile]);

  return (
      <div className={styles.profileForm}>
        <Loader loading={loading}
                spinning={!user}
                spinOn={[
                  `${MODEL_NAME}/query`,
                  `${MODEL_NAME}/handleProfile`,
                  `${MODEL_NAME}/getProfileSubscriptions`,
                  `${MODEL_NAME}/updateActionBtns`
                ]}>
          <Row gutter={[42, 42]}>
            <SubscriptionsColumnize colorsToType={colorsToType}
                                    disabled={disabled}
                                    subscriptions={assignedSubscriptions}/>
          </Row>
        </Loader>
      </div>
  );
};