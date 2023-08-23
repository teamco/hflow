import React from 'react';
import { Col, Divider, Form, Row, Select, Tooltip } from 'antd';
import { useIntl } from '@umijs/max';
import { QuestionCircleTwoTone } from '@ant-design/icons';

import { layout } from '@/utils/layout';
import { t } from '@/utils/i18n';
import { stub } from '@/utils/function';

import { requiredField } from '@/components/Form';
import { fieldName } from '@/components/Form/formProps';

import styles from '@/components/Address/addresses.module.less';

export const AddressType = props => {
  const intl = useIntl();

  const {
    ns,
    disabled,
    aType,
    helper,
    addressTypes = [],
    selectType = stub,
    divider = true
  } = props;

  const typeLabel = t(intl, 'address.type');

  return (
      <>
        <Row gutter={[24, 24]}>
          <Col {...layout.halfColumn}>
            <Form.Item label={typeLabel}
                       rules={[
                         requiredField(intl, typeLabel, true)
                       ]}
                       extra={helper ? t(intl, 'address.type.helper') : null}
                       name={fieldName(ns, 'addressType')}>
              <Select autoComplete={'off'}
                      disabled={disabled}
                      onChange={value => selectType(value)}
                      placeholder={t(intl, 'form.placeholder', { field: typeLabel })}>
                {[...addressTypes].map((address, idx) => (
                    <Select.Option key={idx}
                                   value={address?.type}>
                      <div className={styles.question}>
                        <Tooltip title={t(intl, `address.type.${address.type}.helper`)}>
                          <QuestionCircleTwoTone/>
                        </Tooltip>
                        {t(intl, `address.type.${address.type}`)}
                      </div>
                    </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        {divider && aType && <Divider/>}
      </>
  );
};