import React, { useEffect } from 'react';

import { Input, InputNumber, Select, Slider } from 'antd';
import FormComponents from 'components/Form';
import Duration from '@/components/Price/Range/Duration';

const { GenericPanel } = FormComponents;
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
    subscriptionTypes = [],
    durationTypes = []
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
          <Duration form={formRef}
                    label={t('subscription:period')}
                    disabled={disabled}
                    prefix={[]}
                    required={true}
                    durationTypes={durationTypes}/>
        </div>
        <div>
          <Input type={'text'}
                 label={t('subscription:title')}
                 name={'name'}
                 form={formRef}
                 disabled={disabled}
                 config={{ rules: [{ required: true }] }}/>
          <Input type={'text'}
                 label={t('form:description')}
                 name={['translateKeys', 'description']}
                 form={formRef}
                 disabled={disabled}/>
        </div>
        <div>
          <Slider marks={marks}
                  label={t('subscription:users')}
                  name={'numberOfUsers'}
                  form={formRef}
                  min={dims.min}
                  max={dims.max}
                  disabled={disabled}
                  config={{ rules: [{ required: true }] }}/>
          <></>
        </div>
      </GenericPanel>
  );
};
