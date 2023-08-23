import React from 'react';
import { Form, Input } from 'antd';
import { useIntl } from '@umijs/max';

import { effectHook } from '@/utils/hooks';
import { updateComplexForm } from '@/utils/form';

import { requiredField } from '@/components/Form/index';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const HiddenField = props => {
  const intl = useIntl();

  const { form, label, disabled = false, name = [], data, required = false } = props;
  const isString = typeof name === 'string';
  const _name = isString ? name : [...name].filter(n => n);

  effectHook(() => {
    if (typeof data !== 'undefined') {
      if (isString) {
        form?.setFieldsValue({ [_name]: data });
      } else {
        let namespace = _name.pop();
        updateComplexForm(form, _name, namespace, data);
      }
    }
  }, [data]);

  return (
      <Form.Item label={label} name={_name} noStyle rules={[
        requiredField(intl, label, required)
      ]}>
        <Input type={'hidden'} disabled={disabled}/>
      </Form.Item>
  );
};

export default HiddenField;
