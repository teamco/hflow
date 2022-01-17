import React, { useState } from 'react';
import { Form, Input } from 'antd';
import classnames from 'classnames';

import styles from './form.module.less';
import { effectHook } from '@/utils/state';

const { TextArea } = Input;

/**
 * @export
 * @default
 * @constant
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const MandatoryTextarea = props => {
  const {
    form,
    name,
    label,
    disabled,
    rows = 4,
    allowClear = true,
    showCount = true,
    maxLength = 300,
    className = null,
    config
  } = props;

  const [mandatory, setMandatory] = useState('');

  effectHook(() => {
    handleMandatoryTextarea(name);
  }, [form?.getFieldValue(name)]);

  /**
   * @constant
   * @param name
   */
  const handleMandatoryTextarea = (name) => {
    const value = form?.getFieldValue(name) || '';
    setMandatory(styles[value.length ? 'validated' : 'mandatory']);
  };

  const { rules = [] } = config;

  return (
      <Form.Item label={label}
                 name={name}
                 shouldUpdate
                 form={form}
                 rules={rules}>
        <TextArea disabled={disabled}
                  rows={rows}
                  allowClear={allowClear}
                  showCount={showCount}
                  maxLength={maxLength}
                  onChange={() => handleMandatoryTextarea(name)}
                  className={classnames(mandatory, className)}/>
      </Form.Item>
  );
};

export default MandatoryTextarea;
