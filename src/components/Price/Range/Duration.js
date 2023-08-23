import React from 'react';
import { Form, InputNumber, Select } from 'antd';
import { useIntl } from '@umijs/max';
import HiddenField from '@/components/Form/HiddenField';
import { complexFormKey, updateComplexForm } from '@/utils/form';
import { stub } from '@/utils/function';
import { t } from '@/utils/i18n';
import { requiredField } from '@/components/Form';

const { Option } = Select;

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const Duration = props => {
  const intl = useIntl();

  const {
    form,
    min = 1,
    label,
    disabled,
    durationTypes = [],
    required,
    prefix = [],
    namespace = 'duration',
    onTypeChange = stub,
    onValueChange = stub,
  } = props;

  const wrapper = form.getFieldValue(prefix[0] || namespace);
  const duration = complexFormKey(namespace, wrapper, wrapper?.type && wrapper?.period);

  /**
   * @constant
   * @param {string} value
   */
  const handleFormUpdate = value => {
    updateComplexForm(form, prefix, namespace, { type: value });
    onTypeChange(value);
  };

  /**
   * @constant
   * @type {ValueType|null}
   * @private
   */
  const durationType = duration?.type || durationTypes[0];

  /**
   * @constant
   * @type {JSX.Element}
   */
  const selectDurationBefore = (
      <Select style={{ width: 90 }}
              defaultValue={durationType}
              disabled={disabled}
              onChange={handleFormUpdate}>
        {durationTypes.map((duration, idx) => (
            <Option key={idx} value={duration}>{duration}</Option>
        ))}
      </Select>
  );

  return (
      <>
        <Form.Item noStyle
                   label={label}
                   name={[...prefix, namespace, 'period']}
                   rules={[
                       requiredField(intl, label, required)
                   ]}>
          <InputNumber addonBefore={selectDurationBefore}
                       min={min}
                       onBlur={onValueChange}
                       style={{width: '100%'}}
                       disabled={disabled}
                       placeholder={t(intl, 'form.placeholder', { field: label })}/>
        </Form.Item>
        <HiddenField name={[...prefix, namespace, 'type']}
                     form={form}
                     data={durationType}
                     disabled={disabled}/>
      </>
  );
};

export default Duration;
