import React from 'react';
import { Col } from 'antd';

import EmptyData from '@/components/EmptyData';

import { stub } from '@/utils/function';

import SubscriptionCard from '@/pages/subscriptions/subscriptionCard';

import styles from '@/pages/landing/profile/subscriptions/profile.subscriptions.module.less';

export const SubscriptionsColumnize = (props) => {
  const {
    colorsToType,
    disabled,
    isEdit = false,
    isSelected = () => true,
    subscriptions = [],
    onSelect = stub
  } = props;

  const columnize = (Component, idx = 0, props = {}) => {
    const colProps = { xs: 24, sm: 12, md: 12, lg: 8, xl: 6, xxl: 6 };

    return (
        <Col {...colProps} key={idx}>
          <Component {...props}/>
        </Col>
    );
  };

  return subscriptions?.length ? subscriptions?.map((data, idx) => {
    const props = {
      isEdit,
      colorsToType,
      data,
      disabled,
      selected: isSelected(data),
      className: styles.profileSubscriptionCard,
      onSelectSubscription: onSelect,
      features: { selected: data.features }
    };

    return columnize(SubscriptionCard, idx, props);

  }) : columnize(EmptyData);
};