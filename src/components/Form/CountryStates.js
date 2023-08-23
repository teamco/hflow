import React from 'react';
import { Select, Form } from 'antd';

import { sortBy } from '@/utils/array';
import { useIntl } from '@umijs/max';
import { t } from '@/utils/i18n';

import { getFieldName, requiredField } from '@/components/Form';

const { Option } = Select;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const CountryStates = props => {
  const {
    formRef,
    disabled = false,
    onHandleStates,
    countries = [],
    states = [],
    prefix = ''
  } = props;

  const intl = useIntl();

  const countryField = t(intl, 'address.country');
  const stateField = t(intl, 'address.stateProvince');

  return (
      <>
        <Form.Item name={getFieldName(prefix, 'country')}
                   label={countryField}
                   rules={[
                       requiredField(intl, countryField)
                   ]}>
          <Select disabled={disabled}
                  placeholder={t(intl, 'form.placeholder', { field: countryField })}
                  onSelect={value => {
                    onHandleStates(value);
                    setTimeout(() => {
                      formRef.setFieldsValue({ state: null });
                    }, 0);
                  }}>
            {sortBy(countries, 'name').map(country => (
                <Option key={country?.id}
                        value={country?.id}>
                  {country?.name}
                </Option>
            ))}
          </Select>
        </Form.Item>
        {states.length ? (
            <Form.Item name={getFieldName(prefix, 'state')}
                       label={stateField}
                       rules={[
                           requiredField(intl, stateField)
                       ]}>
              <Select name={[prefix, 'state']}
                      placeholder={t(intl, 'form.placeholder', { field: stateField })}
                      disabled={disabled}>
                {sortBy(states, 'name').map(state => (
                    <Option key={state?.short}
                            value={state?.name}>
                      {state?.name}
                    </Option>
                ))}
              </Select>
            </Form.Item>
        ) : null}
      </>
  );
};
