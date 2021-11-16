import React from 'react';
import { Input, Select } from 'antd';
import countryCodes from 'country-codes-list';

import { sortBy } from 'utils/array';

import FormComponents from 'components/Form';

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
  const {
    t,
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
      <GenericPanel header={t('business:address')}
                    name={'address'}
                    defaultActiveKey={['address']}>
        <div>
          <Phone t={t}
                 label={t('business:phone')}
                 formRef={formRef}
                 disabled={disabled}
                 countryData={getSelectedCountry(formRef)}
                 required={true}/>
          <Input type={'text'}
                 label={t('business:website')}
                 name={'website'}
                 form={formRef}
                 disabled={disabled}
                 config={{
                   rules: [
                     ({ getFieldValue }) => ({
                       validator(_, value) {
                         return !value || value.match(/^http/) ?
                             Promise.resolve() :
                             Promise.reject(t('business:formError', { type: t('business:website') }));
                       }
                     })
                   ]
                 }}/>
        </div>
        <div>
          <Select name={'country'}
                  form={formRef}
                  label={t('address:country')}
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
                      label={t('address:stateProvince')}
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
                 label={t('address:zip')}
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
          <MandatoryTextarea label={t('address')}
                             name={'address'}
                             disabled={disabled}
                             form={formRef}
                             config={{ rules: [{ required: true }] }}/>
          <></>
        </div>
      </GenericPanel>
  );
};
