import React from 'react';
import { useIntl } from '@umijs/max';
import { Form, Select, Switch } from 'antd';

import FormComponents from '@/components/Form';

import { effectHook } from '@/utils/hooks';
import { t } from '@/utils/i18n';

import formStyles from '@/components/Form/form.module.less';

const { GenericPanel } = FormComponents;
const { Option } = Select;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const FeatureInfo = (props) => {
  const intl = useIntl();
  const {
    formRef,
    disabled,
    featureTypes = []
  } = props;

  return (
      <GenericPanel header={t(intl, 'feature.info')}
                    name={'info'}
                    defaultActiveKey={['info']}>
        <div>
          <Select name={'type'}
                  form={formRef}
                  label={t(intl, 'feature.type')}
                  disabled={disabled}
                  config={{ rules: [{ required: true }] }}>
            {[...featureTypes]?.sort()?.map((type, idx) => (
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
