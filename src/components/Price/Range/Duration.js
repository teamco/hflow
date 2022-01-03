import React, { useEffect, useState } from 'react';
import { InputNumber, Select } from 'antd';
import { withTranslation } from 'react-i18next';

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
    disabled,
    durationTypes = [],
    prefix = [],
    required = true,
    namespace = 'duration'
  } = props;

  const {
    label = t('duration'),
    name = [...prefix, namespace, 'period']
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
      <InputNumber addonBefore={selectDurationBefore}
                   label={label}
                   name={name}
                   form={form}
                   min={min}
                   disabled={disabled}
                   config={{ rules: [{ required }] }}/>
  );
};

export default withTranslation()(Duration);
