import React, { useEffect, useState } from 'react';

import { DatePicker, Input, Select } from 'antd';
import FormComponents from 'components/Form';
import { DEFAULT_DATE_FORMAT } from '@/utils/timestamp';
import moment from 'moment';

const { GenericPanel, MandatoryTextarea, HiddenField } = FormComponents;
const { Option } = Select;
const { RangePicker } = DatePicker;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const CampaignInfo = (props) => {
  const {
    t,
    formRef,
    disabled,
    subscriptions,
  } = props;

  const [subscriptionId, setSubscriptionId] = useState(false);
  const [featuresList, setFeaturesList] = useState([]);

  const handleSubscriptionType = (id) => {
      setSubscriptionId(id);
      const subscription = [...subscriptions].find(el => el.id === id);
      formRef.setFieldsValue({ subscriptionType: subscription.featureType});
  }

  const handleFeatureList = (list) => {
    setFeaturesList(list);
  }

  const getOptions = () => {
    const subscription = [...subscriptions]
                            .find(el => el.id === subscriptionId)
                            .features.map((item, idx) => (
        <Option key={idx}
                value={item.id}>
          {t(item.translateKeys.title)}
        </Option>
    ));
    return subscription;
  }

  return (
      <GenericPanel header={t('campaign:info')}
                    name={'info'}
                    defaultActiveKey={['info']}>
        <div>
          <Input type={'text'}
                 label={t('campaign:title')}
                 name={'title'}
                 form={formRef}
                 disabled={disabled}
                 config={{ rules: [{ required: false }] }} />
          <Input type={'text'}
                 label={t('campaign:description')}
                 name={'description'}
                 form={formRef}
                 disabled={disabled}
                 config={{ rules: [{ required: false }] }}/>
        </div>
        <div>
          <Select name={'type'}
                  form={formRef}
                  label={t('subscription:type')}
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
          <Select
              name={'featuresByRef'}
              mode="multiple"
              label={t('subscription:features')}
              allowClear
              style={{ width: '100%' }}
              placeholder="Please select features "
              onChange={handleFeatureList}
          >
            {subscriptionId && getOptions()}
          </Select>
        </div>
        <div>
          <RangePicker name={'saleInfo'}
                       form={formRef}
                       format={DEFAULT_DATE_FORMAT}
                       disabledDate={current => current && current < moment().endOf('day')}
                       disabled={disabled}
                       placeholder={[t('subscription:saleStart'), t('subscription:saleEnd')]}
                       config={{ rules: [{ type: 'array', required: true }] }}
                       label={t('subscription:saleAt')}/>
        </div>
        <>
          <HiddenField name={['subscriptionType']}
                       form={formRef}
                       disabled={disabled}/>
        </>
      </GenericPanel>
  );
};
