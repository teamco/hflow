import React from 'react';
import { useIntl } from '@umijs/max';
import { Select } from 'antd';

import FormComponents, { getFieldValue } from '@/components/Form';

import { t } from '@/utils/i18n';
import { isSpinning } from '@/utils/state';
import { sortBy } from '@/utils/array';

const { GenericPanel } = FormComponents;
const { Option } = Select;

const MODEL_NAME = 'campaignModel';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const CampaignInfo = (props) => {
  const intl = useIntl();

  const {
    formRef,
    disabled,
    loading,
    isEdit,
    subscriptions = [],
    typeSubscriptionsMap,
    setPriceAccumulation,
    onUpdateEntityForm
  } = props;

  /**
   * @constant
   * @return {*|null}
   */
  const getOptions = () => {
    const subscriptionRef = getFieldValue(formRef, 'subscriptionRef');

    return subscriptionRef ?
        sortBy(
            [...subscriptions].find(el => el.id === subscriptionRef)?.features,
            'translateKeys.title',
            intl
        ).map((item, idx) => {
          return (
              <Option key={idx}
                      value={item.id}>
                {t(intl, item.translateKeys.title)}
              </Option>
          );
        }) : null;
  };

  /**
   * @constant
   * @param ids
   */
  const handlePriceAcquiring = (ids) => {
    const subscriptionRef = getFieldValue(formRef, 'subscriptionRef');
    const selectedSubscription = [...subscriptions].find(el => el.id === subscriptionRef);
    const features = selectedSubscription.features;
    let sum = 0;
    ids.forEach(item => {
      const feature = features.find(feature => feature.id === item);
      const price = feature.price.originalPrice;
      sum += price;
    });
    setPriceAccumulation(sum);
  };

  /**
   * @constant
   * @return {*[]}
   */
  const getSubscriptionTypes = () => {
    return (typeSubscriptionsMap instanceof Map) &&
        [...typeSubscriptionsMap?.entries()].sort().map((type, idx) => (
            <Option key={idx}
                    value={type[0]}>
              {type[0]}
            </Option>
        ));
  };

  /**
   * @constant
   * @return {unknown}
   */
  const getSubscriptionsByType = () => {
    const subscriptionType = getFieldValue(formRef, 'subscriptionType');
    const listOfSubscriptions = (typeSubscriptionsMap instanceof Map) &&
        typeSubscriptionsMap.get(subscriptionType);

    return listOfSubscriptions && sortBy(
        listOfSubscriptions,
        'translateKeys.title',
        intl
    ).map((item, idx) => (
        <Option key={idx}
                value={item.id}>
          {t(intl, item.translateKeys.title)}
        </Option>
    ));
  };

  const onChangeCleanSelection = (fields = []) => {
    onUpdateEntityForm(Object.fromEntries(fields.map(field => [field])));
  };

  const isSubscriptionTypeSelected = formRef.getFieldValue('subscriptionType');
  const isSubscriptionSelected = formRef.getFieldValue('subscriptionRef');

  const col24Props = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 };

  return (
      <GenericPanel header={t(intl, 'campaigns.info')}
                    name={'info'}
                    defaultActiveKey={['info']}>
        <div>
          <Select name={'subscriptionType'}
                  form={formRef}
                  label={t(intl, 'campaigns.subscription.type')}
                  disabled={disabled || isEdit}
                  onChange={() => onChangeCleanSelection(['subscriptionRef', 'featuresByRef'])}
                  config={{ rules: [{ required: true }] }}>
            {getSubscriptionTypes()}
          </Select>
          <Select name={'subscriptionRef'}
                  form={formRef}
                  label={t(intl, 'campaigns.subscription.title')}
                  disabled={disabled || isEdit || !isSubscriptionTypeSelected}
                  onChange={() => onChangeCleanSelection(['featuresByRef'])}
                  config={{ rules: [{ required: true }] }}>
            {getSubscriptionsByType()}
          </Select>
        </div>
        <div colProps={col24Props}
             spinOn={() => isSpinning(loading, [
               `${MODEL_NAME}/campaignSubscriptions`
             ])}>
          <Select name={'featuresByRef'}
                  mode={'multiple'}
                  label={t(intl, 'subscription.features')}
                  onChange={handlePriceAcquiring}
                  disabled={disabled || !isSubscriptionSelected}
                  allowClear
                  form={formRef}
                  config={{ rules: [{ required: true }] }}
                  style={{ width: '100%' }}>
            {getOptions()}
          </Select>
        </div>
      </GenericPanel>
  );
};
