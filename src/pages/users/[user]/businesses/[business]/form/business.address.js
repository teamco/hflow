import React from 'react';
import { Input, Select } from 'antd';
import countryCodes from 'country-codes-list';
import { useIntl } from 'umi';
import { sortBy } from '@/utils/array';

import FormComponents from '@/components/Form';

/**
 * @constant
 * @param formRef
 * @return {{currencyNameEn, flag, tinType, officialLanguageNameEn, countryNameEn,
 *   countryCallingCode, countryCode, tinName, officialLanguageCode,
 *   countryNameLocal, officialLanguageNameLocal, region, currencyCode}}
 */
const getSelectedCountry = formRef => {
  const country = formRef.getFieldValue('country');
  return countryCodes.findOne('countryCode', country) || {};
};

const { Option } = Select;
const { GenericPanel, MandatoryTextarea, Phone } = FormComponents;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const BusinessAddress = props => {
  const intl = useIntl();
  const {
    formRef,
    countries = [],
    states = [],
    disabled,
    cities,
    setCities,
    citiesFilter,
    setCitiesFilter,
    onHandleStates
  } = props;

  return (
      <GenericPanel header={intl.formatMessage({id: 'business.address', defaultMessage: 'Business Address'})}
                    name={'address'}
                    defaultActiveKey={['address']}>
        <div>
          <Phone t={t}
                 label={intl.formatMessage({id: 'business.phone', defaultMessage: 'Phone Number'})}
                 formRef={formRef}
                 disabled={disabled}
                 countryData={getSelectedCountry(formRef)}
                 required={true}/>
          <Input type={'text'}
                 label={intl.formatMessage({id: 'business.website', defaultMessage: 'Website'})}
                 name={'website'}
                 form={formRef}
                 disabled={disabled}
                 config={{
                   rules: [
                     ({ getFieldValue }) => ({
                       validator(_, value) {
                         return !value || value.match(/^http/) ?
                             Promise.resolve() :
                             Promise.reject(intl.formatMessage({id: 'business:formError', defaultMessage: 'The' +
                                   ' {type} supplied did not seem to be a {type}'}, { type: intl.formatMessage({id: 'business.website', defaultMessage: 'Website'}) }));
                       }
                     })
                   ]
                 }}/>
        </div>
        <div>
          <Select name={'country'}
                  form={formRef}
                  label={intl.formatMessage({id: 'address.country', defaultMessage: 'Country'})}
                  disabled={disabled}
                  onSelect={value => {
                    onHandleStates(value);
                    formRef.setFieldsValue({ state: null });
                  }}
                  config={{ rules: [{ required: true }] }}>
            {sortBy(countries, 'name').map(country => (
                <Option key={country?.id}
                        value={country?.id}>
                  {country?.name}
                </Option>
            ))}
          </Select>
          {states.length ? (
              <Select name={'state'}
                      form={formRef}
                      disabled={disabled}
                      label={intl.formatMessage({id: 'address.stateProvince', defaultMessage: 'State / Province'})}
                      config={{ rules: [{ required: true }] }}>
                {sortBy(states, 'name').map(state => (
                    <Option key={state?.short}
                            value={state?.name}>
                      {state?.name}
                    </Option>
                ))}
              </Select>
          ) : <></>}
        </div>
        <div>
          <Input type={'text'}
                 label={intl.formatMessage({id: 'address.zip', defaultMessage: 'Postal Code'})}
                 name={'zip'}
                 form={formRef}
                 disabled={disabled}
                 allowClear
                 onChange={() => {
                   formRef.setFieldsValue({
                     zip: formRef.getFieldValue('zip').toUpperCase()
                   });
                 }}
                 config={{ rules: [{ required: true }] }}/>
          <></>
        </div>
        <div>
          <MandatoryTextarea label={intl.formatMessage({id: 'address', defaultMessage: 'Address'})}
                             name={'address'}
                             disabled={disabled}
                             form={formRef}
                             config={{ rules: [{ required: true }] }}/>
          <></>
        </div>
      </GenericPanel>
  );
};
