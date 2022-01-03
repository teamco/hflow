import React, { useEffect, useState } from 'react';
import { Form, InputNumber, Select } from 'antd';
import { withTranslation } from 'react-i18next';
import HiddenField from '@/components/Form/HiddenField';

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
    prefix,
    namespace = 'duration'
  } = props;

  const { duration } = form.getFieldValue(prefix[0] || namespace);
  const [durationType, setDurationType] = useState(duration?.type);

  useEffect(() => {
    setDurationType(duration?.type || durationTypes[0]);
  }, [duration?.type]);

  /**
   * @constant
   * @param {string} value
   */
  const handleFormUpdate = value => {
    const _duration = { duration: { type: value } };
    const field = prefix[0] ? { [prefix[0]]: _duration } : _duration;

    form.setFieldsValue(field);
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
        <Form.Item name={[...prefix, namespace, 'type']}
                   noStyle>
          <HiddenField name={[...prefix, namespace, 'type']}
                       disabled={disabled}/>
        </Form.Item>
      </>
  );
};

export default withTranslation()(Duration);
