import React, { useEffect, useState } from 'react';

import { Form, InputNumber, Select, Switch } from 'antd';
import FormComponents from '@/components/Form';

const { GenericPanel, HiddenField } = FormComponents;
const { Option } = Select;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const FeatureInfo = (props) => {
  const {
    t,
    formRef,
    disabled,
    currency,
    currencies,
    featureTypes
  } = props;

  useEffect(() => {
    handleFormUpdate(currency);
  }, [currency]);

  /**
   * @constant
   * @param {string} value
   */
  const handleFormUpdate = value => {
    formRef.setFieldsValue({ price: { currency: value } });
  };

  /**
   * @constant
   * @type {JSX.Element}
   */
  const selectCurrencyBefore = (
      <Select style={{ width: 90 }}
              value={currency}
              disabled={disabled}
              onChange={handleFormUpdate}>
        {[...currencies]?.map((type, idx) => (
            <Option key={idx} value={type}>{type}</Option>
        ))}
      </Select>
  );

  return (
      <GenericPanel header={t('feature:info')}
                    name={'info'}
                    defaultActiveKey={['info']}>
        <div>
          <Select name={'type'}
                  form={formRef}
                  label={t('feature:type')}
                  disabled={disabled}
                  config={{ rules: [{ required: true }] }}>
            {[...featureTypes]?.sort()?.map((type, idx) => (
                <Option key={idx}
                        value={type}>
                  {type}
                </Option>
            ))}
          </Select>
          <InputNumber addonBefore={selectCurrencyBefore}
                       label={t('feature:price')}
                       name={['price', 'originalPrice']}
                       form={formRef}
                       min={0}
                       disabled={disabled}
                       config={{ rules: [{ required: true }] }}/>
        </div>
        <div>
          <Switch label={t('feature:status')}
                  disabled={disabled}
                  form={formRef}
                  config={{ valuePropName: 'checked' }}
                  checkedChildren={t('actions:yes')}
                  unCheckedChildren={t('actions:no')}
                  name={'selectedByDefault'}/>
        </div>
        <div>
          <HiddenField name={['price', 'currency']}
                       form={formRef}
                       disabled={disabled}/>
        </div>
      </GenericPanel>
  );
};
