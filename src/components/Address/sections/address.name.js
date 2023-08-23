import React from 'react';
import { Col, Divider, Row } from 'antd';
import { useIntl } from '@umijs/max';

import { layout } from '@/utils/layout';
import { t } from '@/utils/i18n';

import { FormInput } from '@/components/Form';
import { fieldName } from '@/components/Form/formProps';

export const AddressName = props => {
  const intl = useIntl();

  const { testId, ns, disabled, divider = true, rules = {}, helper } = props;

  const isName = rules?.mandatory?.includes('name');
  const isCompanyName = rules?.mandatory?.includes('companyName');

  return (isName || isCompanyName) ? (
      <>
        <Row gutter={[24, 24]} data-testid={testId}>
          {isName ? (
              <Col {...layout.halfColumn}>
                <FormInput name={fieldName(ns, 'name')}
                           label={t(intl, 'form.fullName')}
                           intl={intl}
                           extra={helper ? t(intl, 'address.name.helper') : null}
                           required={true}
                           disabled={disabled}/>
              </Col>
          ) : null}
          {isCompanyName ? (
              <Col {...layout.halfColumn}>
                <FormInput name={fieldName(ns, 'companyName')}
                           label={t(intl, 'address.companyName')}
                           intl={intl}
                           extra={helper ? t(intl, 'address.companyName.helper') : null}
                           required={true}
                           disabled={disabled}/>
              </Col>
          ) : null}
        </Row>
        {divider && <Divider/>}
      </>
  ) : null;
};