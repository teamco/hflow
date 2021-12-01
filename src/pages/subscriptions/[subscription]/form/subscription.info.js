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
    businessUsers: { dims },
    subscriptionTypes = []
  } = props;

  let marks = {};
  for (let i = dims.min; i <= dims.max; i++) {
    marks[i] = i;
  }

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
          <InputNumber type={'text'}
                       addonBefore={t('currency')}
                       label={t('subscription:price')}
                       name={'price'}
                       form={formRef}
                       disabled={disabled}
                       config={{ rules: [{ required: true }] }}/>
          <Slider marks={marks}
                  label={t('subscription:users')}
                  name={'users'}
                  form={formRef}
                  min={dims.min}
                  max={dims.max}
                  disabled={disabled}/>
        </div>
        <div>
          <TextArea type={'text'}
                    label={t('form:description')}
                    name={'description'}
                    rows={4}
                    showCount
                    maxLength={300}
                    disabled={disabled}
                    form={formRef}/>
          <></>
        </div>
      </GenericPanel>
  );
};
