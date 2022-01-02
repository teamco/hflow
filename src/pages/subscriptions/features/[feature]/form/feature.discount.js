import React, { useEffect, useState } from 'react';

import Rebate from '@/components/Price/Rebate';

const DISCOUNT_TYPES = ['%', 'currency'];

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const FeatureDiscount = (props) => {
  const {
    formRef,
    disabled,
    discountTypes = DISCOUNT_TYPES
  } = props;

  const { currency } = formRef.getFieldValue('price');

  const [types, setTypes] = useState(discountTypes);

  useEffect(() => {
    setTypes(discountTypes.map(type => (type === 'currency' ? currency : type)));
  }, [currency]);

  return (
      <Rebate.Discount formRef={formRef}
                       disabled={disabled}
                       discountTypes={types}/>
  );
};
