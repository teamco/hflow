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
                       collapsed={true}
                       currencies={currencies}
                       durationTypes={durationTypes}
                       discountTypes={discountTypes}>

        <div><Divider/></div>
        <div>
          <Duration form={formRef}
                    label={t('price:trialDuration')}
                    disabled={disabled}
                    prefix={['trialPeriod', 'duration']}
                    durationTypes={durationTypes}/>
        </div>
      </Rebate.Discount>
  );
};

export default withTranslation()(FeatureTrial);
