import React from 'react';
import { useIntl } from '@umijs/max';

import Rebate from '@/components/Price/Rebate';

import { stub } from '@/utils/function';
import { t } from '@/utils/i18n';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const PriceSection = (props) => {
  const {
    formRef,
    disabled,
    durationTypes = [],
    currencies = [],
    discountTypes,
    expectedOriginalPrice,
    readOnlyFields,
    renderScheduler = stub,
    onOpenSiderPanel = stub,
    loading
  } = props;

  const intl = useIntl();

  const MODEL_NAME = 'subscriptionModel';

  return (
      <Rebate.Discount formRef={formRef}
                       disabled={disabled}
                       prefix={['price']}
                       discountHeader={t(intl, 'panel.price')}
                       onOpenSiderPanel={onOpenSiderPanel}
                       loading={loading}
                       namespace={'discount'}
                       modelName={MODEL_NAME}
                       priceMin={0}
                       renderScheduler={renderScheduler}
                       currencies={currencies}
                       readOnlyFields={readOnlyFields}
                       expectedOriginalPrice={expectedOriginalPrice}
                       durationTypes={durationTypes}
                       discountTypes={discountTypes}/>
  );
};
