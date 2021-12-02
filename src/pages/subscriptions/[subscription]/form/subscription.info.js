import { Input, InputNumber, Select, Slider } from 'antd';

import FormComponents from 'components/Form';
import React from 'react';

const { GenericPanel } = FormComponents;
const { TextArea } = Input;
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
    discountTypes,
    businessUsers: { dims },
    subscriptionTypes = []
  } = props;

  let marks = {};
  for (let i = dims.min; i <= dims.max; i++) {
    marks[i] = i;
  }

  /**
   * @constant
   * @param {string} value
   */
  const handleFormUpdate = value => {
    formRef.setFieldsValue({ discountType: value });
  };

  /**
   * @constant
   * @type {JSX.Element}
   */
  const selectDiscountBefore = (
      <Select style={{ width: 90 }}
              disabled={disabled}
              onChange={handleFormUpdate}>
        <Option key={'percentage'} value={discountTypes?.percentage}>
          {discountTypes?.percentage}
        </Option>
        <Option key={'currency'} value={discountTypes?.currency}>
          {discountTypes?.currency}
        </Option>
      </Select>
  );

  return (
      <GenericPanel header={t('subscription:info')}
                    name={'info'}
                    defaultActiveKey={['info']}>
        <div>
          <Select name={'subscriptionTypes'}
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
          <Input type={'text'}
                 label={t('subscription:name')}
                 name={'name'}
                 form={formRef}
                 disabled={disabled}
                 config={{ rules: [{ required: true }] }}/>
        </div>
        <div>
          <InputNumber addonBefore={t('currency')}
                       label={t('subscription:price')}
                       name={'price'}
                       form={formRef}
                       disabled={disabled}
                       config={{ rules: [{ required: true }] }}/>
          <InputNumber addonBefore={selectDiscountBefore}
                       label={t('subscription:discount')}
                       name={'discount'}
                       form={formRef}
                       disabled={disabled}/>
        </div>
        <div>
          <Slider marks={marks}
                  label={t('subscription:users')}
                  name={'users'}
                  form={formRef}
                  min={dims.min}
                  max={dims.max}
                  disabled={disabled}/>
          <TextArea type={'text'}
                    label={t('form:description')}
                    name={'description'}
                    rows={4}
                    showCount
                    maxLength={300}
                    disabled={disabled}
                    form={formRef}/>
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
