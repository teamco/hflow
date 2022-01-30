import React from 'react';

import { DatePicker, Divider, Select, Slider } from 'antd';
import FormComponents from '@/components/Form';
import Duration from '@/components/Price/Range/Duration';
import { DEFAULT_DATE_FORMAT } from '@/utils/timestamp';
import moment from 'moment';

const { GenericPanel } = FormComponents;
const { Option } = Select;
const { RangePicker } = DatePicker;

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
                    label={t('subscription:duration')}
                    disabled={disabled}
                    prefix={[]}
                    namespace={'paymentDuration'}
                    required={true}
                    durationTypes={durationTypes}/>
        </div>
        <div colProps={{ xs: 24, sm: 12, md: 12, lg: 8, xl: 8, xxl: 8 }}>
          <Slider marks={marks}
                  label={t('subscription:users')}
                  name={'numberOfUsers'}
                  form={formRef}
                  min={dims.min}
                  max={dims.max}
                  disabled={disabled}
                  config={{ rules: [{ required: true }] }}/>
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
      </GenericPanel>
  );
};
