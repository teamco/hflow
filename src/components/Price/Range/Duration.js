import React, { useEffect, useState } from 'react';
import { Form, InputNumber, Select } from 'antd';
import { withTranslation } from 'react-i18next';
import HiddenField from '@/components/Form/HiddenField';
import { complexFormKey, updateComplexForm } from '@/utils/form';

const { Option } = Select;

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const Duration = props => {
  const {
    t,
    form,
    min = 0,
    label,
    disabled,
    durationTypes = [],
    required,
    prefix = [],
    namespace = 'duration'
  } = props;

  const wrapper = form.getFieldValue(prefix[0] || namespace);
  const duration = complexFormKey(wrapper, namespace, wrapper.type && wrapper.period);
  const [durationType, setDurationType] = useState(duration?.type);

  useEffect(() => {
    handleFormUpdate(duration?.type || durationTypes[0]);
  }, [duration?.type]);

  /**
   * @constant
   * @param {string} value
   */
  const handleFormUpdate = value => {
    updateComplexForm(form, prefix, namespace, { type: value });
    setDurationType(value);
  };

  /**
   * @constant
   * @type {JSX.Element}
   */
  const selectDurationBefore = (
      <Select style={{ width: 90 }}
              value={durationType}
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
                   name={[...prefix, namespace, 'period']}
                   rules={[
                     {
                       required,
                       message: t('form:required', { field: label })
                     }
                   ]}>
          <InputNumber addonBefore={selectDurationBefore}
                       min={min}
                       disabled={disabled}
                       placeholder={t('form:placeholder', { field: label })}/>
        </Form.Item>
        <HiddenField name={[...prefix, namespace, 'type']}
                     disabled={disabled}/>
      </>
  );
};

export default withTranslation()(Duration);
