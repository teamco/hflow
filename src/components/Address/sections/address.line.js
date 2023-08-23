import React from 'react';
import { Col, Divider, Row } from 'antd';
import { useIntl } from '@umijs/max';

import { layout } from '@/utils/layout';
import { t } from '@/utils/i18n';

import { FormInput } from '@/components/Form';
import { fieldName } from '@/components/Form/formProps';

export const AddressLine = props => {
  const intl = useIntl();

  const { ns, disabled, divider = true, rules = {}, helper } = props;

  const isAddressLine1 = rules?.mandatory?.includes('addressLine1');
  const isAddressLine2 = rules?.mandatory?.includes('addressLine2');
  const isZipCode = rules?.mandatory?.includes('zipCode');

  return isAddressLine1 || isAddressLine2 || isZipCode ? (
      <>
        <Row gutter={[24, 24]}>
          {isAddressLine1 ? (
              <Col {...layout.fullColumn}>
                <FormInput name={fieldName(ns, 'addressLine1')}
                           label={t(intl, 'address.addressLine', { type: 1 })}
                           intl={intl}
                           extra={helper ? t(intl, 'address.addressLine1.helper') : null}
                           required={true}
                           disabled={disabled}/>
              </Col>
          ) : null}
          {isAddressLine2 ? (
              <Col {...layout.fullColumn}>
                <FormInput name={fieldName(ns, 'addressLine2')}
                           label={t(intl, 'address.addressLine', { type: 2 })}
                           extra={helper ? t(intl, 'address.addressLine2.helper') : null}
                           intl={intl}
                           required={false}
                           disabled={disabled}/>
              </Col>
          ) : null}
          {isZipCode ? (
              <Col {...layout.halfColumn}>
                <FormInput name={fieldName(ns, 'zipCode')}
                           label={t(intl, 'address.zip')}
                           intl={intl}
                           extra={helper ? t(intl, 'address.zip.helper') : null}
                           required={true}
                           disabled={disabled}/>
              </Col>
          ) : null}
        </Row>
        {divider && <Divider/>}
      </>
  ) : null;
};