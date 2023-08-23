import React from 'react';
import { useIntl } from '@umijs/max';

import Rebate from '@/components/Price/Rebate';
import { effectHook } from '@/utils/hooks';
import { updateComplexForm } from '@/utils/form';
import { stub } from '@/utils/function';
import { t } from '@/utils/i18n';
import CampaignTrial from '@/pages/campaigns/[campaign]/form/campaign.trial';

const MODEL_NAME = 'campaignModel';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const CampaignDiscount = (props) => {
  const {
    formRef,
    disabled,
    durationTypes = [],
    currencies = [],
    discountTypes,
    setIsTrialed,
    expectedOriginalPrice = 0,
    readOnlyFields,
    originalPrice,
    loading,
    onOpenSiderPanel = stub
  } = props;

  const intl = useIntl();

  effectHook(() => {
    updateComplexForm(formRef, ['price'], 'originalPrice', originalPrice);
  }, [originalPrice]);

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
