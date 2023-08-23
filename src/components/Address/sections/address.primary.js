import React from 'react';
import { Col, Divider, Form, Row, Switch } from 'antd';
import { useIntl } from '@umijs/max';

import { layout } from '@/utils/layout';
import { t } from '@/utils/i18n';
import { stub } from '@/utils/function';

import { fieldName } from '@/components/Form/formProps';

export const AddressPrimary = props => {
  const intl = useIntl();

  const {
    ns,
    disabled,
    helper,
    divider = true
  } = props;

  return (
      <>
        <Row gutter={[24, 24]}>
          <Col {...layout.halfColumn}>
            <Form.Item name={fieldName(ns, 'primary')}
                       label={t(intl, 'address.primary')}
                       extra={helper ? t(intl, 'address.primary.helper') : null}
                       valuePropName={'checked'}>
              <Switch checkedChildren={t(intl, 'address.switch.primary')}
                      unCheckedChildren={t(intl, 'address.switch.no')}
                      disabled={disabled}/>
            </Form.Item>
          </Col>
          <Col {...layout.halfColumn}>
            <Form.Item name={fieldName(ns, 'billing')}
                       label={t(intl, 'address.billing')}
                       extra={helper ? t(intl, 'address.billing.helper') : null}
                       valuePropName={'checked'}>
              <Switch checkedChildren={t(intl, 'address.switch.yes')}
                      unCheckedChildren={t(intl, 'address.switch.no')}
                      disabled={disabled}/>
            </Form.Item>
          </Col>
        </Row>
        {divider && <Divider/>}
      </>
  );
};