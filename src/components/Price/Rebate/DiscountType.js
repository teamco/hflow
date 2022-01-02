import React from 'react';
import { Input } from 'antd';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const DiscountType = props => {
  const { formRef, disabled, prefix = [], namespace } = props;

  return (
      <Input type={'hidden'}
             name={[...prefix, namespace, 'type']}
             form={formRef}
             disabled={disabled}/>
  );
};

export default DiscountType;
