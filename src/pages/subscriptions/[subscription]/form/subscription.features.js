import React, { useState } from 'react';
import { Card, Col, Row, Select, Slider } from 'antd';
import { FormOutlined, TagTwoTone } from '@ant-design/icons';
import { useIntl } from '@umijs/max';

import FormComponents from '@/components/Form';
import EmptyData from '@/components/EmptyData';
import OpenPanelButton from '@/components/Buttons/openPanel.button';

import { sortBy } from '@/utils/array';
import { effectHook } from '@/utils/hooks';
import { isSpinning } from '@/utils/state';
import { t } from '@/utils/i18n';
import { layout } from '@/utils/layout';

import { handleExpectedFeaturesPrice } from '@/services/price.service';

import styles from '@/pages/subscriptions/subscriptions.module.less';
import HiddenField from '@/components/Form/HiddenField';

const { GenericPanel } = FormComponents;
const { Option } = Select;
const { Meta } = Card;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const SubscriptionFeatures = (props) => {
  const intl = useIntl();

  const {
    isEdit,
    formRef,
    disabled,
    businessUsers: { dims },
    features = [],
    featuresByRef = [],
    featureTypes = [],
    selectedSubscription = {},
    onChangeFeatureType,
    setExpectedOriginalPrice,
    onOpenSiderPanel,
    loading
  } = props;

  const MODEL_NAME = 'subscriptionModel';

  const [businessUserHidden, setBusinessUserHidden] = useState(false);

  const _featureType = formRef.getFieldValue('featureType');
  const isBusinessType = _featureType === 'Business';

  const filteredFeaturesByType = Array.isArray(features) ?
      features?.filter(feature => featuresByRef.includes(feature.id)) : [];

  let marks = {};
  for (let i = dims.min; i <= dims.max; i++) {
    marks[i] = i;
  }

  effectHook(() => {
    [...filteredFeaturesByType].forEach(pref => {
      const value = (_featureType || {})[pref.id];
      if (typeof value === 'undefined') {
        formRef.setFieldsValue({
          featuresByRef: {
            [pref.id]: isEdit ?
                featuresByRef.includes(pref.id) :
                pref.selectedByDefault
          }
        });
      }
    });

    handleExpectedFeaturesPrice({
      refs: formRef.getFieldsValue().featuresByRef,
      setter: setExpectedOriginalPrice,
      features
    });

  }, [filteredFeaturesByType]);

  effectHook(() => {
    setBusinessUserHidden(!isBusinessType);
  }, [_featureType]);

  const colProps = { xs: 24, sm: 12, md: 8, lg: 8, xl: 6, xxl: 4 };
  const rowProps = { gutter: [layout.rowProps, layout.rowProps] };

  return (
      <GenericPanel header={`${t(intl, 'subscription.features')} (${filteredFeaturesByType.length})`}
                    extra={(
                        <OpenPanelButton onClick={() => onOpenSiderPanel(true)}
                                         loading={loading}
                                         spinOn={[`${MODEL_NAME}/features`]}
                                         icon={<FormOutlined/>}
                                         label={t(intl, 'subscription.feature')}/>
                    )}
                    name={'features'}
                    defaultActiveKey={['features']}>
        <div colProps={colProps}
             spinOn={() => isSpinning(loading, [
               `${MODEL_NAME}/subscriptionTypes`
             ])}>
          <Select name={'featureType'}
                  form={formRef}
                  label={t(intl, 'feature.type')}
                  disabled={disabled}
                  onChange={type => {
                    onChangeFeatureType(type);
                    setBusinessUserHidden(!isBusinessType);
                  }}
                  config={{ rules: [{ required: true }] }}>
            {[...featureTypes].sort().map((type, idx) => (
                <Option key={idx}
                        value={type}>
                  {type}
                </Option>))}
          </Select>
          {businessUserHidden ? null : (
              <Slider marks={marks}
                      label={t(intl, 'subscription.users')}
                      name={'numberOfUsers'}
                      form={formRef}
                      min={dims.min}
                      max={dims.max}
                      disabled={disabled}
                      config={{ rules: [{ required: true }] }}/>
          )}
        </div>
        <div colProps={layout.fullColumn}
             spinOn={() => isSpinning(loading, [
               `${MODEL_NAME}/changeFeatureType`,
               `${MODEL_NAME}/features`
             ])}>
          <Row {...rowProps} className={styles.featureCards}>
            {filteredFeaturesByType?.length ?
                sortBy(
                    filteredFeaturesByType,
                    'translateKeys.title',
                    intl
                ).map((pref, idx) => {
                  const { title, description = 'error.na' } = pref.translateKeys;

                  return (
                      <Col key={idx} {...colProps}>
                        <Card hoverable className={styles.featureCard}>
                          <Meta title={(
                              <div className={styles.featureCardTitle}>
                                <TagTwoTone/>
                                {t(intl, title)}
                              </div>
                          )}
                                description={t(intl, description)}/>
                        </Card>
                      </Col>
                  );
                }) : (
                    <Col className={styles.featureCards} key={'features.empty'}>
                      <EmptyData/>
                      <HiddenField name={'featuresByRef'}
                                   label={t(intl, 'subscription.features')}
                                   form={formRef}
                                   required={true}
                                   data={filteredFeaturesByType}
                                   disabled={disabled}/>
                    </Col>
                )}
          </Row>
        </div>
      </GenericPanel>
  );
};
