import React, { useState } from 'react';
import { Col, Form, Row, Input, Divider } from 'antd';
import { useIntl } from '@umijs/max';

import { t } from '@/utils/i18n';

import { requiredField } from '@/components/Form';

import styles from '../profile.apartmentEdit.module.less';
import { stub } from '@/utils/function';
import { AddressCountry } from '@/components/Address/sections/address.country';
import { effectHook } from '@/utils/hooks';
import { resetField } from '@/components/Form/formProps';
import { AddressLine } from '@/components/Address/sections/address.line';

export const InfoSection = props => {
  const intl = useIntl();

  const [country, selectCountry] = useState(null);
  const [state, selectState] = useState(null);
  const [city, selectCity] = useState(null);

  const {
    addressModel,
    formRef,
    canUpdate,
    disabled,
    selected,
    setSelected = stub,
    onFieldsChange = stub,
    onGetAllCountries = stub,
    onGetCountryStates = stub,
    onGetStateCities = stub
  } = props;

  const {
    addressTypes = [],
    countries = [],
    countryStates = [],
    stateCities = []
  } = addressModel;

  const col2Props = { xs: 24, sm: 24, md: 12, lg: 12, xl: 12, xxl: 12 };

  const _descShort = t(intl, 'form.shortDescription');
  const _descLong = t(intl, 'form.description');

  const rules = addressTypes.find(rule => rule.type === 'RES');

  const countryProps = {
    rules,
    formRef,
    countries,
    countryStates,
    stateCities,
    country,
    state,
    disabled,
    divider: false,
    selectCountry,
    selectState,
    selectCity
  };

  const lineProps = {
    disabled,
    divider: false,
    rules
  };

  effectHook(() => {
    onGetAllCountries();
  });

  effectHook(() => {
    if (country) {
      onGetCountryStates(country);
    } else {
      cleanCountryFields('state');
    }
  }, [country]);

  effectHook(() => {
    if (state) {
      onGetStateCities(country, state);
    } else {
      cleanCountryFields('city');
    }
  }, [state]);

  const cleanCountryFields = (type) => {
    if (type === 'state') {
      selectState(null);
    }

    selectCity(null);
    resetField(type, formRef);
  };

  return (
      <div className={styles.info}>
        <Row gutter={[24, 24]}>
          <Col {...col2Props}>
            <Form.Item label={_descShort}
                       name={'shortDescription'}
                       rules={[
                         requiredField(intl, _descShort, true)
                       ]}
                       tooltip={requiredField(intl, _descShort).message}
                       disabled={disabled}>
              <Input.TextArea type={'text'}
                              disabled={disabled}
                              rows={4}
                              showCount
                              placeholder={t(intl, 'form.placeholder', { field: _descShort })}
                              maxLength={200}/>
            </Form.Item>
          </Col>
          <Col {...col2Props}>
            <Form.Item label={_descLong}
                       name={'description'}
                       rules={[
                         requiredField(intl, _descLong, true)
                       ]}
                       tooltip={requiredField(intl, _descLong).message}
                       disabled={disabled}>
              <Input.TextArea type={'text'}
                              rows={4}
                              showCount
                              maxLength={400}
                              placeholder={t(intl, 'form.placeholder', { field: _descLong })}
                              disabled={disabled}/>
            </Form.Item>
          </Col>
        </Row>
        <Divider/>
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <AddressLine {...lineProps} />
          </Col>
          <Col span={12}>
            <AddressCountry {...countryProps}/>
          </Col>
        </Row>
        <Divider/>
      </div>
  );
};