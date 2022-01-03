import React, { useEffect, useState } from 'react';

import Rebate from '@/components/Price/Rebate';
import Range from '@/components/Price/Range';

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
    durationTypes = [],
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
                       prefix={['price']}
                       namespace={'discount'}
                       durationTypes={durationTypes}
                       discountTypes={types}/>
  );
};
