import React from 'react';
import { useIntl } from 'umi';
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
  const intl = useIntl();
  const {
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
      <GenericPanel header={intl.formatMessage({id: 'subscription.info', defaultMessage: 'Subscription Info'})}
                    name={'info'}
                    defaultActiveKey={['info']}>
        <div>
          <Select name={'type'}
                  form={formRef}
                  label={intl.formatMessage({id: 'subscription.type', defaultMessage: 'Subscription Type'})}
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
                    label={intl.formatMessage({id: 'subscription.duration', defaultMessage: 'Payment Duration'})}
                    disabled={disabled}
                    prefix={[]}
                    namespace={'paymentDuration'}
                    required={true}
                    durationTypes={durationTypes}/>
        </div>
        <div colProps={{ xs: 24, sm: 12, md: 12, lg: 8, xl: 8, xxl: 8 }}>
          <Slider marks={marks}
                  label={intl.formatMessage({id: 'subscription.users', defaultMessage: 'Maximum of Business users'})}
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
                       placeholder={[intl.formatMessage({id: 'subscription.saleStart', defaultMessage: 'Started at'}), intl.formatMessage({id: 'subscription.saleEnd', defaultMessage: 'Expired at'})]}
                       config={{ rules: [{ type: 'array', required: true }] }}
                       label={intl.formatMessage({id: 'subscription.saleAt', defaultMessage: 'Sale Started / Expired (at)'})}/>
        </div>
      </GenericPanel>
  );
};
