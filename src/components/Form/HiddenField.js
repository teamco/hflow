import React from 'react';
import { Form, Input } from 'antd';
import { effectHook } from '@/utils/hooks';
import { updateComplexForm } from '@/utils/form';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const HiddenField = props => {
  const { form, label, disabled = false, name = [], value } = props;
  const isString = typeof name === 'string';
  const _name = isString ? name : [...name].filter(n => n);

  effectHook(() => {
    if (isString) {
      form?.setFieldsValue({ [_name]: value });
    } else {
      let namespace = _name.pop();
      updateComplexForm(form, _name, namespace, value);
    }
  });

  return (
      <Form.Item label={label} name={_name} noStyle>
        <Input type={'hidden'} disabled={disabled}/>
      </Form.Item>
  );
};

export default HiddenField;
