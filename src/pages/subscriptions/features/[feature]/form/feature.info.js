import React from 'react';

import { Select, Switch } from 'antd';
import FormComponents from '@/components/Form';
import { effectHook } from '@/utils/hooks';

const { GenericPanel } = FormComponents;
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
    featureTypes = [],
    setIsTrialed
  } = props;

  const isChecked = formRef.getFieldValue('trialed');

  effectHook(() => {
    handleTrialToggling(isChecked);
  }, [isChecked]);

  /**
   * @constant
   * @param {boolean} checked
   */
  const handleTrialToggling = checked => {
    setIsTrialed(checked);
  };

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
          <Switch label={t('feature:status')}
                  disabled={disabled}
                  form={formRef}
                  config={{ valuePropName: 'checked' }}
                  checkedChildren={t('actions:yes')}
                  unCheckedChildren={t('actions:no')}
                  name={'selectedByDefault'}/>
          <Switch label={t('price:trialed')}
                  disabled={disabled}
                  form={formRef}
                  onChange={handleTrialToggling}
                  config={{ valuePropName: 'checked' }}
                  checkedChildren={t('actions:yes')}
                  unCheckedChildren={t('actions:no')}
                  name={'trialed'}/>
        </div>
      </GenericPanel>
  );
};
