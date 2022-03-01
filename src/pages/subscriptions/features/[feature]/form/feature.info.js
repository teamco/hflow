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
      <GenericPanel header={intl.formatMessage({id: 'feature.info', defaultMessage: 'Feature Info'})}
                    name={'info'}
                    defaultActiveKey={['info']}>
        <div>
          <Select name={'type'}
                  form={formRef}
                  label={intl.formatMessage({id: 'feature.type', defaultMessage: 'Type'})}
                  disabled={disabled}
                  config={{ rules: [{ required: true }] }}>
            {[...featureTypes]?.sort()?.map((type, idx) => (
                <Option key={idx}
                        value={type}>
                  {type}
                </Option>
            ))}
          </Select>
          <Switch label={intl.formatMessage({id: 'feature.status', defaultMessage: 'Default State'})}
                  disabled={disabled}
                  form={formRef}
                  config={{ valuePropName: 'checked' }}
                  checkedChildren={intl.formatMessage({id: 'actions.yes', defaultMessage: 'Yes'})}
                  unCheckedChildren={intl.formatMessage({id: 'actions.no', defaultMessage: 'No'})}
                  name={'selectedByDefault'}/>
          <Switch label={intl.formatMessage({id: 'price.trialed', defaultMessage: 'Is Trialed?'})}
                  disabled={disabled}
                  form={formRef}
                  onChange={handleTrialToggling}
                  config={{ valuePropName: 'checked' }}
                  checkedChildren={intl.formatMessage({id: 'actions.yes', defaultMessage: 'Yes'})}
                  unCheckedChildren={intl.formatMessage({id: 'actions.no', defaultMessage: 'No'})}
                  name={'trialed'}/>
        </div>
      </GenericPanel>
  );
};
