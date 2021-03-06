import React, { useState } from 'react';
import { useIntl } from 'umi';
import { DatePicker, Select } from 'antd';
import FormComponents from '@/components/Form';
import { DEFAULT_DATE_FORMAT } from '@/utils/timestamp';
import moment from 'moment';
import { effectHook } from '@/utils/hooks';

const { GenericPanel, HiddenField } = FormComponents;
const { Option } = Select;
const { RangePicker } = DatePicker;

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
    subscriptions
  } = props;

  const getValue = key => formRef?.getFieldValue(key);

  const [subscriptionId, setSubscriptionId] = useState(false);
  const [featuresList, setFeaturesList] = useState([]);
  const subscriptionRefId = getValue('type');

  effectHook(() => {
    if (subscriptionRefId && subscriptions.length > 0) {
      handleSubscriptionType(subscriptionRefId);
    }
  }, [subscriptionRefId, subscriptions]);

  const handleSubscriptionType = (id) => {
    setSubscriptionId(id);
    const subscription = [...subscriptions]?.find(el => el.id === id);
    formRef.setFieldsValue({ subscriptionType: subscription.featureType });
  };

  const handleFeatureList = (list) => {
    setFeaturesList(list);
  };

  const getOptions = () => {
    return [...subscriptions].find(el => el.id === subscriptionId)?.
        features?.map((item, idx) => (
            <Option key={idx}
                    value={item.id}>
              {intl.formatMessage({id: item.translateKeys.title})}
            </Option>
        ));
  };

  /**
   * @constant
   * @param {Event} e
   * @param {function} handler
   */

  return (
      <GenericPanel header={intl.formatMessage({id: 'campaign.info', defaultMessage: 'Campaign Info'})}
                    name={'info'}
                    defaultActiveKey={['info']}>
        <div>
          <Select name={'type'}
                  form={formRef}
                  label={intl.formatMessage({id: 'subscription.type', defaultMessage: 'Subscription Type'})}
                  disabled={disabled}
                  onChange={(id) => handleSubscriptionType(id)}
                  config={{ rules: [{ required: true }] }}>
            {[...subscriptions].map((item, idx) => (
                <Option key={idx}
                        value={item.id}>
                  {item.type}
                </Option>
            ))}
          </Select>
          <Select name={'featuresByRef'}
                  mode={'multiple'}
                  label={intl.formatMessage({id: 'subscription.features', defaultMessage: 'Features'})}
                  allowClear
                  style={{ width: '100%' }}>
            {subscriptionId && getOptions()}
          </Select>
        </div>
        <div>
          <RangePicker name={'saleInfo'}
                       form={formRef}
                       format={DEFAULT_DATE_FORMAT}
                       disabledDate={current => current && current < moment().endOf('day')}
                       disabled={disabled}
                       placeholder={[intl.formatMessage({id: 'subscription.saleStart', defaultMessage: 'Started at'}), intl.formatMessage({id: 'subscription.saleEnd', defaultMessage: 'Expired at'})]}
                       config={{ rules: [{ type: 'array', required: true }] }}
                       label={intl.formatMessage({id: 'subscription.saleAt', defaultMessage: 'Sale Started / Expired (at)'})}/>
        </div>
        <>
          <HiddenField name={['subscriptionType']}
                       form={formRef}
                       disabled={disabled}/>
        </>
      </GenericPanel>
  );
};
