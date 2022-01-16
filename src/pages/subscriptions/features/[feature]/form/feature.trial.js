import React from 'react';
import { withTranslation } from 'react-i18next';
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
    t,
    formRef,
    disabled,
    durationTypes = [],
    currencies = [],
    discountTypes = []
  } = props;

  return (
      <Rebate.Discount formRef={formRef}
                       disabled={disabled}
                       header={t('panel:trialPriceInfo')}
                       prefix={['trialPeriod', 'price']}
                       namespace={'discount'}
                       priceMin={0}
                       currencies={currencies}
                       durationTypes={durationTypes}
                       discountTypes={discountTypes}>
        <Divider orientation={'left'}>{t('price:trial')}</Divider>
        <Duration form={formRef}
                  label={t('price:trialDuration')}
                  disabled={disabled}
                  prefix={['trialPeriod', 'duration']}
                  required={false}
                  durationTypes={durationTypes}/>
      </Rebate.Discount>
  );
};

export default withTranslation()(FeatureTrial);
