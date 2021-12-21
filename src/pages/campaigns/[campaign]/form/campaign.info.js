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
    subscriptionModel = [],
  } = props;

  const {
    subscriptions = []
  } = subscriptionModel;

  useEffect(() => {
  });

  /**
   * @constant
   * @param {string} value
   */
  const handleFormUpdate = value => {
    formRef.setFieldsValue({ discountType: value });
    setDiscountType(value);
  };

  return (
      <GenericPanel header={t('campaign:info')}
                    name={'info'}
                    defaultActiveKey={['info']}>
        <div>
          <Select name={'subscriptionType'}
                  form={formRef}
                  label={t('subscription:type')}
                  disabled={disabled}
                  config={{ rules: [{ required: true }] }}>
            {[...subscriptions].sort().map((type, idx) => (
                <Option key={idx}
                        value={type}>
                  {type}
                </Option>
            ))}
          </Select>
        </div>
        <div>
          {/*<Switch disabled={disabled}*/}
          {/*        checked={enableHelper}*/}
          {/*        onChange={toggleHelper}*/}
          {/*        checkedChildren={t('actions:yes')}*/}
          {/*        unCheckedChildren={t('actions:no')}/>*/}
          <Input type={'text'}
                 label={t('campaign:title')}
                 name={'title'}
                 form={formRef}
                 disabled={disabled}
                 config={{ rules: [{ required: true }] }}/>
        </div>
        <div>
          <Input type={'text'}
                 label={t('campaign:notice')}
                 name={'notice'}
                 form={formRef}
                 disabled={disabled}
                 config={{ rules: [{ required: true }] }}/>
        </div>
      </GenericPanel>
  );
};
