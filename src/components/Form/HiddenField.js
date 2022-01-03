import React from 'react';
import { Input } from 'antd';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const HiddenField = props => {
  const { form, disabled = false, name = [] } = props;
  const _name = typeof name === 'string' ? name : [...name].filter(n => n);

  return (
      <Input type={'hidden'}
             name={_name}
             form={form}
             disabled={disabled}/>
  );
};

export default HiddenField;
