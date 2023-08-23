import React from 'react';
import { useIntl } from '@umijs/max';

import Rebate from '@/components/Price/Rebate';

import { stub } from '@/utils/function';
import { t } from '@/utils/i18n';

const MODEL_NAME = 'featureModel';

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
    currencies = [],
    discountTypes,
    setIsTrialed,
    expectedOriginalPrice = 0,
    readOnlyFields,
    onOpenSiderPanel = stub,
    loading
  } = props;

  const intl = useIntl();

  return (
      <Rebate.Discount formRef={formRef}
                       disabled={disabled}
                       prefix={['price']}
                       header={t(intl, 'panel.priceInfo', { type: t(intl, 'price.sale') })}
                       discountHeader={t(intl, 'panel.price')}
                       onOpenSiderPanel={onOpenSiderPanel}
                       loading={loading}
                       namespace={'discount'}
                       priceMin={0}
                       trialed={true}
                       setIsTrialed={setIsTrialed}
                       modelName={MODEL_NAME}
                       currencies={currencies}
                       readOnlyFields={readOnlyFields}
                       expectedOriginalPrice={expectedOriginalPrice}
                       durationTypes={durationTypes}
                       discountTypes={discountTypes}/>
  );
};
