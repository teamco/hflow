import React from 'react';

import { t } from '@/utils/i18n';
import { handleUpdatePanel } from '@/utils/panel';

import FeaturesPanel from '@/pages/subscriptions/[subscription]/panels/features/features.panel.connect';
import Scheduler from '@/components/Scheduler';

/**
 * @constant
 * @param panelProps
 * @param {boolean} [visible]
 */
export const updateFeaturesPanel = (panelProps, visible = false) => {
  const {
    intl,
    ability,
    formRef,
    MODEL_NAME,
    onChangeFeatureType
  } = panelProps;

  /**
   * @constant
   * @type {*&{visible: boolean, onReload(): void, header: string, render: (function())}}
   * @private
   */
  const _panelProps = {
    ...panelProps,
    position: 'fixed',
    visible,
    onReload() {
      const _featureType = formRef.getFieldValue('featureType');
      onChangeFeatureType(_featureType);
    },
    render: () => (
        <FeaturesPanel ability={ability}
                       formRef={formRef}
                       spinOn={[`${MODEL_NAME}/features`]}
                       onQuery={onChangeFeatureType}/>
    ),
    header: t(intl, 'subscription.features')
  };

  handleUpdatePanel('features', _panelProps);
};

/**
 * @constant
 * @param panelProps
 * @param {boolean} [visible]
 */
export const updateSchedulerPanel = (panelProps, visible = false) => {
  const {
    intl,
    ability,
    MODEL_NAME,
    loading,
    component,
    entityForm,
    entityType,
    isEdit = false,
    onHandleScheduler,
    durationTypes,
    prefix
  } = panelProps;

  /**
   * @constant
   * @type {*&{visible: boolean, header: string, render: (function())}}
   * @private
   */
  const _panelProps = {
    ...panelProps,
    position: 'fixed',
    visible,
    render: () => (
        <Scheduler loading={loading}
                   prefix={prefix}
                   ability={ability}
                   entityForm={entityForm}
                   entityType={entityType}
                   modelName={MODEL_NAME}
                   component={component}
                   isEdit={isEdit}
                   entityName={'subscription'}
                   durationTypes={durationTypes}
                   onHandleScheduler={onHandleScheduler}/>
    ),
    header: t(intl, 'scheduler')
  };

  handleUpdatePanel('scheduler', _panelProps);
};