import React from 'react';
import { Col, Divider, Row } from 'antd';
import { useIntl } from '@umijs/max';

import { layout } from '@/utils/layout';
import { t } from '@/utils/i18n';

import { FormInput } from '@/components/Form';
import { fieldName } from '@/components/Form/formProps';

export const AddressBox = props => {
  const intl = useIntl();

  const { ns, disabled, divider = true, rules = {}, helper } = props;

  const isPoBox = rules?.mandatory?.includes('poBox');
  const isBoxNumber = rules?.mandatory?.includes('boxNumber');

  return isPoBox || isBoxNumber ? (
      <>
        <Row gutter={[24, 24]}>
          {isPoBox ? (
              <Col {...layout.halfColumn}>
                <FormInput name={fieldName(ns, 'poBox')}
                           extra={helper ? t(intl, 'address.poBox.helper') : null}
                           label={t(intl, 'address.poBox')}
                           intl={intl}
                           required={false}
                           disabled={disabled}/>
              </Col>
          ) : null}
          {isBoxNumber ? (
              <Col {...layout.halfColumn}>
                <FormInput name={fieldName(ns, 'boxNumber')}
                           extra={helper ? t(intl, 'address.poBox.helper') : null}
                           label={t(intl, 'address.boxNumber')}
                           intl={intl}
                           required={false}
                           disabled={disabled}/>
              </Col>
          ) : null}
        </Row>
        {divider && <Divider/>}
      </>
  ) : null;
};