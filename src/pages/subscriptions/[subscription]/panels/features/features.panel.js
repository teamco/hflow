import React from 'react';
import { Spin } from 'antd';

import { effectHook } from '@/utils/hooks';
import { isSpinning } from '@/utils/state';

import Main from '@/components/Main';

import { metadata } from './features.panel.metadata';

const { Table } = Main;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const FeaturesPanel = (props) => {
  const {
    loading,
    ability,
    formRef,
    onQuery,
    onAssignFeature,
    onAssignAllFeatures,
    subscriptionModel,
    spinOn = []
  } = props;

  const {
    features,
    selectedSubscription = {}
  } = subscriptionModel;

  const _featureType = formRef.getFieldValue('featureType');

  effectHook(() => {
    // Cache items
    !features.length && onQuery(_featureType);
  });

  const {
    featuresByRef = []
  } = selectedSubscription || {};

  const component = 'features';
  const disabled = ability.cannot('assign', component);

  const metadataProps = {
    loading,
    disabled,
    ability,
    assignedFeatures: featuresByRef,
    onAssign: onAssignFeature,
    onAssignAll: onAssignAllFeatures,
    features
  };

  return (
      <Spin spinning={isSpinning(loading, spinOn)}>
        <Table data={features} {...metadata({ ...metadataProps })} />
      </Spin>
  );
};