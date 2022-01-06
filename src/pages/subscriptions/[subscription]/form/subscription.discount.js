import React from 'react';
import Rebate from '@/components/Price/Rebate';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const SubscriptionDiscount = (props) => {
  const {
    formRef,
    disabled,
    durationTypes = [],
    discountTypes
  } = props;

  return (
      <Rebate.Discount formRef={formRef}
                       disabled={disabled}
                       prefix={['price']}
                       namespace={'discount'}
                       durationTypes={durationTypes}
                       discountTypes={discountTypes}/>
  );
};
