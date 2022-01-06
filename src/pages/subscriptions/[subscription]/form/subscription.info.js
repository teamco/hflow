import React, { useEffect } from 'react';

import { Input, InputNumber, Select, Slider } from 'antd';
import FormComponents from 'components/Form';

const { GenericPanel, MandatoryTextarea } = FormComponents;
const { Option } = Select;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const SubscriptionInfo = (props) => {
  const {
    t,
    formRef,
    disabled,
    currency,
    currencies=[],
    businessUsers: { dims },
    subscriptionTypes = [],
    subscriptionPeriod = {}
  } = props;

  let marks = {};
  for (let i = dims.min; i <= dims.max; i++) {
    marks[i] = i;
  }

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
      <GenericPanel header={t('subscription:info')}
                    name={'info'}
                    defaultActiveKey={['info']}>
        <div>
          <Select name={'type'}
                  form={formRef}
                  label={t('subscription:type')}
                  disabled={disabled}
                  config={{ rules: [{ required: true }] }}>
            {[...subscriptionTypes].sort().map((type, idx) => (
                <Option key={idx}
                        value={type}>
                  {type}
                </Option>
            ))}
          </Select>
          <Select name={'subscriptionPeriod'}
                  form={formRef}
                  label={t('subscription:period')}
                  disabled={disabled}
                  config={{ rules: [{ required: true }] }}>
            {[...Object.keys(subscriptionPeriod)].sort().map((period, idx) => (
                <Option key={idx}
                        value={period}>
                  {subscriptionPeriod[period]}
                </Option>
            ))}
          </Select>
        </div>
        <div>
          <Input type={'text'}
                 label={t('subscription:title')}
                 name={'title'}
                 form={formRef}
                 disabled={disabled}
                 config={{ rules: [{ required: true }] }}/>
          <Input type={'text'}
                 label={t('subscription:notice')}
                 name={'notice'}
                 form={formRef}
                 disabled={disabled}
                 config={{ rules: [{ required: true }] }}/>
        </div>
        <div>
          <InputNumber addonBefore={selectCurrencyBefore}
                       label={t('price:originalPrice')}
                       name={['price', 'originalPrice']}
                       form={formRef}
                       min={1}
                       disabled={disabled}
                       config={{ rules: [{ required: true }] }}/>
          <></>
        </div>
        <div>
          <Slider marks={marks}
                  label={t('subscription:users')}
                  name={'users'}
                  form={formRef}
                  min={dims.min}
                  max={dims.max}
                  disabled={disabled}
                  config={{ rules: [{ required: true }] }}/>
          <MandatoryTextarea type={'text'}
                             label={t('form:description')}
                             name={'description'}
                             rows={4}
                             showCount
                             maxLength={300}
                             disabled={disabled}
                             form={formRef}
                             config={{ rules: [{ required: true }] }}/>
        </div>
        <div>
          <Input type={'hidden'}
                 name={'discountType'}
                 form={formRef}
                 disabled={disabled}/>
        </div>
      </GenericPanel>
  );
};
