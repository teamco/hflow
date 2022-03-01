import React from 'react';
import { Divider } from 'antd';

import Rebate from '@/components/Price/Rebate';
import Duration from '@/components/Price/Range/Duration';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const FeatureTrial = (props) => {
  const {
    formRef,
    disabled,
    durationTypes = [],
    currencies = [],
    discountTypes
  } = props;

  return (
      <Rebate.Discount formRef={formRef}
                       disabled={disabled}
                       header={intl.formatMessage({id: 'panel.trialPriceInfo', defaultMessage: 'Trial Period'})}
                       prefix={['trialPeriod', 'price']}
                       namespace={'discount'}
                       priceMin={0}
                       currencies={currencies}
                       durationTypes={durationTypes}
                       discountTypes={discountTypes}>
        <Divider orientation={'left'}>{intl.formatMessage({id: 'price.trial', defaultMessage: 'Is Trialed?'})}</Divider>
        <Duration form={formRef}
                  label={intl.formatMessage({id: 'price.trialDuration', defaultMessage: 'Trial Period Duration'})}
                  disabled={disabled}
                  prefix={['trialPeriod']}
                  required={true}
                  durationTypes={durationTypes}/>
      </Rebate.Discount>
  );
};

export default FeatureTrial;
