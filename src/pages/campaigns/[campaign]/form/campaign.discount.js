import React, { useEffect, useState } from 'react';

import Rebate from '@/components/Price/Rebate';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const CampaignDiscount = (props) => {
  const {
    t,
    formRef,
    disabled,
    durationTypes = [],
    discountTypes,
    currencies
  } = props;

  return (
      <Rebate.Discount formRef={formRef}
                       disabled={disabled}
                       prefix={['price']}
                       namespace={'discount'}
                       currencies={currencies}
                       durationTypes={durationTypes}
                       discountTypes={discountTypes}/>
  );
};
