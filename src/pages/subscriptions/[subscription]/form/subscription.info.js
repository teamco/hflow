import React from 'react';
import { useIntl } from '@umijs/max';
import { Select } from 'antd';

import FormComponents from '@/components/Form';

import { t } from '@/utils/i18n';
import { layout } from '@/utils/layout';

const { GenericPanel } = FormComponents;
const { Option } = Select;

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
    subscriptionTypes = []
  } = props;

  return (
      <GenericPanel header={t(intl, 'subscription.info')}
                    name={'info'}
                    defaultActiveKey={['info']}>
        <div colProps={layout.halfColumn}>
          <Select name={'type'}
                  form={formRef}
                  label={t(intl, 'subscription.type')}
                  disabled={disabled}
                  config={{ rules: [{ required: true }] }}>
            {[...subscriptionTypes].sort().map((type, idx) => (
                <Option key={idx}
                        value={type}>
                  {type}
                </Option>
            ))}
          </Select>
        </div>
      </GenericPanel>
  );
};
