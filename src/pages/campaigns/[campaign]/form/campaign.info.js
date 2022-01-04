import React, { useEffect, useState } from 'react';

import { Input, InputNumber, Select, DatePicker, Switch } from 'antd';
import FormComponents from 'components/Form';

const { GenericPanel, MandatoryTextarea } = FormComponents;
const { Option } = Select;

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
      </GenericPanel>
  );
};
