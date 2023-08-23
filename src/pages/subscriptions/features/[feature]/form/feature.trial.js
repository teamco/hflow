import React from 'react';
import { useIntl } from '@umijs/max';

import Rebate from '@/components/Price/Rebate';
import Duration from '@/components/Price/Range/Duration';

import { stub } from '@/utils/function';
import { t } from '@/utils/i18n';
import { layout } from '@/utils/layout';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const FeatureTrial = (props) => {
  const intl = useIntl();

  const {
    formRef,
    disabled,
    loading,
    durationTypes = [],
    currencies = [],
    discountTypes,
    expectedOriginalPrice = 0,
    readOnlyFields,
    onOpenSiderPanel = stub
  } = props;

  const headerTitle = t(intl, 'panel.trialPriceInfo');

  return (
      <Rebate.Discount formRef={formRef}
                       disabled={disabled}
                       prefix={['trialPeriod', 'price']}
                       header={t(intl, 'panel.priceInfo', { type: t(intl, 'price.trial') })}
                       discountHeader={headerTitle}
                       onOpenSiderPanel={onOpenSiderPanel}
                       loading={loading}
                       namespace={'discount'}
                       currencies={currencies}
                       readOnlyFields={readOnlyFields}
                       priceMin={0}
                       childrenColProps={layout.halfColumn}
                       expectedOriginalPrice={expectedOriginalPrice}
                       durationTypes={durationTypes}
                       discountTypes={discountTypes}>
        <Duration form={formRef}
                  label={t(intl, 'price.trialDuration')}
                  disabled={disabled}
                  prefix={['trialPeriod']}
                  required={true}
                  loading={loading}
                  durationTypes={durationTypes}/>
      </Rebate.Discount>
  );
};

export default FeatureTrial;
