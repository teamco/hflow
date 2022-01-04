import React from 'react';
import { Form, Input } from 'antd';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const HiddenField = props => {
  const { form, label, disabled = false, name = [] } = props;
  const _name = typeof name === 'string' ? name : [...name].filter(n => n);

  return (
      <Form.Item label={label} name={_name} noStyle>
        <Input type={'hidden'} disabled={disabled}/>
      </Form.Item>
  );
};

export default HiddenField;
