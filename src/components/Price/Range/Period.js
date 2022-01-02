import React from 'react';
import { Input } from 'antd';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const Period = props => {
  const { formRef, disabled, prefix } = props;

  return (
      <Input type={'hidden'}
             name={['price', 'discount', 'type']}
             form={formRef}
             disabled={disabled}/>
  );
};

export default Period;
