import React, { useEffect, useState } from 'react';

import Reduction from '@/components/Price/Reduction';

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
      <Reduction.Discount formRef={formRef}
                          disabled={disabled}
                          discountTypes={types}/>
  );
};
