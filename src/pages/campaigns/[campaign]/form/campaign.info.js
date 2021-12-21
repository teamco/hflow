import React, { useEffect, useState } from 'react';

import { Input, InputNumber, Select, Slider, Switch } from 'antd';
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
    subscriptions
  } = props;

  // const {
  //   subscriptions = []
  // } = subscriptionModel;

  useEffect(() => {

  });

  const [subscriptionId, setSubscriptionId] = useState(false);
  const [preferencesList, setPreferencesList] = useState([]);

  /**
   * @constant
   * @param {string} value
   */
  // const handleFormUpdate = value => {
  //   formRef.setFieldsValue({ discountType: value });
  //   setDiscountType(value);
  // };

  const handleSubscriptionType = (id) => {
      setSubscriptionId(id);
  }

  const handlePreferenceList = (list) => {
    setPreferencesList(list);
  }

  const getOptions = () => {
    const subscription = [...subscriptions]
                            .find(el => el.id === subscriptionId)
                            .preferences.map((item, idx) => (
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
          <Select name={'subscriptionType'}
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
              name={'subscriptionPref'}
              mode="multiple"
              label={t('subscription:preferences')}
              allowClear
              style={{ width: '100%' }}
              placeholder="Please select preferences "
              onChange={handlePreferenceList}
          >
            {subscriptionId && getOptions()}
          </Select>
        </div>
        <div>

        </div>
        <div>
          <Switch disabled={disabled}
                  checkedChildren={t('actions:yes')}
                  unCheckedChildren={t('actions:no')}/>
          <Input type={'text'}
                 label={t('campaign:duration')}
                 name={'duration'}
                 form={formRef}
                 disabled={disabled}
                 config={{ rules: [{ required: true }] }}/>
        </div>
        <div>
          <Switch
                  disabled={disabled}
                  checkedChildren={t('actions:yes')}
                  unCheckedChildren={t('actions:no')}/>
          <Input type={'text'}
                 label={t('campaign:startAt')}
                 name={'statDay'}
                 form={formRef}
                 disabled={disabled}
                 config={{ rules: [{ required: true }] }}/>
        </div>
      </GenericPanel>
  );
};
