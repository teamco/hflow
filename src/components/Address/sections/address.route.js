import React from 'react';
import { Col, Divider, Row } from 'antd';
import { useIntl } from '@umijs/max';

import { layout } from '@/utils/layout';
import { t } from '@/utils/i18n';

import { FormInput } from '@/components/Form';
import { fieldName } from '@/components/Form/formProps';

export const AddressRoute = props => {
  const intl = useIntl();

  const {
    ns,
    disabled,
    helper,
    rules = {},
    divider = true
  } = props;

  const isRuralRoute = rules?.mandatory?.includes('ruralRoute');
  const isHighwayContractRoute = rules?.mandatory?.includes('highwayContractRoute');
  const isGeneralDelivery = rules?.mandatory?.includes('generalDelivery');

  return isRuralRoute || isHighwayContractRoute || isGeneralDelivery ? (
      <>
        <Row gutter={[24, 24]}>
          {isRuralRoute ? (
              <Col {...layout.fullColumn}>
                <FormInput name={fieldName(ns, 'ruralRoute')}
                           label={t(intl, 'address.ruralRoute')}
                           intl={intl}
                           extra={helper ? t(intl, 'address.ruralRoute.helper') : null}
                           required={true}
                           disabled={disabled}/>
              </Col>
          ) : null}
          {isHighwayContractRoute ? (
              <Col {...layout.fullColumn}>
                <FormInput name={fieldName(ns, 'highwayContractRoute')}
                           label={t(intl, 'address.highwayContractRoute')}
                           intl={intl}
                           extra={helper ? t(intl, 'address.highwayContractRoute.helper') : null}
                           required={true}
                           disabled={disabled}/>
              </Col>
          ) : null}
          {isGeneralDelivery ? (
              <Col {...layout.fullColumn}>
                <FormInput name={fieldName(ns, 'generalDelivery')}
                           label={t(intl, 'address.generalDelivery')}
                           intl={intl}
                           extra={helper ? t(intl, 'address.generalDelivery.helper') : null}
                           required={true}
                           disabled={disabled}/>
              </Col>
          ) : null}
        </Row>
        {divider && <Divider/>}
      </>
  ) : null;
};