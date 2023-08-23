import React from 'react';
import { useIntl } from '@umijs/max';
import { Row } from 'antd';

import { effectHook } from '@/utils/hooks';
import { componentAbilities } from '@/utils/auth/component.setting';

import Loader from '@/components/Loader';

import { SubscriptionsColumnize } from '@/pages/landing/profile/subscriptions/subscription.columnize';

import styles from './profile.subscriptions.all.module.less';

const MODEL_NAME = 'profileModel';

export const ProfileSubscriptionsAll = props => {
  const intl = useIntl();

  const {
    loading,
    authModel,
    profileModel,
    subscriptionModel,
    onQuery,
    onGetSubscriptions,
    onSelectSubscription
  } = props;

  const { user } = authModel;
  const {
    sUser,
    sProfile,
    subscriptions = []
  } = profileModel;
  const { colorsToType } = subscriptionModel;

  const { subscriptionsByRef = [] } = sUser || {};

  const component = 'profile.subscriptions.all';

  const { disabled } = componentAbilities(authModel, component, false);

  effectHook(() => {
    user && onQuery();
  }, [user]);

  effectHook(() => {
    sProfile && onGetSubscriptions();
  }, [sProfile]);

  return (
      <div className={styles.profileForm}>
        <Loader spinning={!user}
                loading={loading}
                spinOn={[
                  `${MODEL_NAME}/query`,
                  `${MODEL_NAME}/handleProfile`,
                  `${MODEL_NAME}/getSubscriptions`,
                  `${MODEL_NAME}/assignSubscription`,
                  `${MODEL_NAME}/updateActionBtns`
                ]}>
          <Row gutter={[42, 42]}>
            <SubscriptionsColumnize colorsToType={colorsToType}
                                    disabled={disabled}
                                    isSelect={(data) => subscriptionsByRef.includes(data.id)}
                                    subscriptions={subscriptions}
                                    onSelect={onSelectSubscription}/>
          </Row>
        </Loader>
      </div>
  );
};