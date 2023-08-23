import React from 'react';
import { Col, Divider, Form, Row, Select } from 'antd';
import { useIntl } from '@umijs/max';

import { layout } from '@/utils/layout';
import { t } from '@/utils/i18n';
import { stub } from '@/utils/function';

import { requiredField } from '@/components/Form';
import { fieldName } from '@/components/Form/formProps';

export const AddressCountry = props => {
  const intl = useIntl();

  const {
    ns,
    disabled,
    helper,
    rules = {},
    divider = true,
    countries = [],
    countryStates = [],
    stateCities = [],
    country,
    state,
    selectCountry = stub,
    selectState = stub,
    selectCity = stub
  } = props;

  const countryLabel = t(intl, 'address.country');
  const stateLabel = t(intl, 'address.stateProvince');
  const cityLabel = t(intl, 'address.city');

  const isCountry = rules?.mandatory?.includes('country');
  const isState = rules?.mandatory?.includes('state');
  const isCity = rules?.mandatory?.includes('city');

  return isCountry ? (
      <>
        <Row gutter={[24, 24]}>
          {isCountry ? (
              <Col {...layout.halfColumn}>
                <Form.Item label={countryLabel}
                           rules={[
                             requiredField(intl, countryLabel, true)
                           ]}
                           extra={helper ? t(intl, 'address.country.helper') : null}
                           name={fieldName(ns, 'country')}>
                  <Select showSearch
                          autoComplete={'off'}
                          disabled={disabled}
                          onSelect={value => selectCountry(countries.find(country => country?.name === value))}
                          placeholder={t(intl, 'form.placeholder', { field: countryLabel })}>
                    {[...countries].map((country, idx) => (
                        <Select.Option key={idx}
                                       value={country?.name}>
                          {country?.name}
                        </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
          ) : null}
          {country && isState && countryStates.length ? (
              <Col {...layout.halfColumn}>
                <Form.Item label={stateLabel}
                           rules={[
                             requiredField(intl, stateLabel, true)
                           ]}
                           extra={helper ? t(intl, 'address.state.helper') : null}
                           name={fieldName(ns, 'state')}>
                  <Select showSearch
                          autoComplete={'off'}
                          disabled={disabled}
                          onSelect={value => selectState(countryStates.find(state => state?.name === value))}
                          placeholder={t(intl, 'form.placeholder', { field: stateLabel })}>
                    {[...countryStates].map((state, idx) => (
                        <Select.Option key={idx}
                                       value={state?.name}>
                          {state?.name}
                        </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
          ) : null}
        </Row>
        {state && isCity && stateCities.length ? (
            <Row gutter={[24, 24]}>
              <Col {...layout.fullColumn}>
                <Form.Item label={cityLabel}
                           rules={[
                             requiredField(intl, cityLabel, true)
                           ]}
                           extra={helper ? t(intl, 'address.city.helper') : null}
                           name={fieldName(ns, 'city')}>
                  <Select showSearch
                          autoComplete={'off'}
                          disabled={disabled}
                          onSelect={value => selectCity(stateCities.find(city => city?.name === value))}
                          placeholder={t(intl, 'form.placeholder', { field: cityLabel })}>
                    {[...stateCities].map((city, idx) => (
                        <Select.Option key={idx}
                                       value={city?.name}>
                          {city?.name}
                        </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
        ) : null}
        {divider && <Divider/>}
      </>
  ) : null;
};