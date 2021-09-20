import React from 'react';
import {Input, Select} from 'antd';
import countryCodes from 'country-codes-list';

import {sortBy} from 'utils/array';

import FormComponents from 'components/Form';
import Phone from 'components/Form/phone';

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

const {Option} = Select;
const {TextArea} = Input;
const {GenericPanel} = FormComponents;

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
                 countryData={getSelectedCountry(formRef)}
                 required={true} />
          <Input type={'text'}
                 label={t('business:website')}
                 name={'website'}
                 form={formRef}
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
                 }} />
        </div>
        <div>
          <Select name={'country'}
                  form={formRef}
                  label={t('address:country')}
                  onSelect={value => {
                    onHandleStates(value);
                    formRef.setFieldsValue({state: null});
                  }}
                  config={{rules: [{required: true}]}}>
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
                      label={t('address:stateProvince')}
                      config={{rules: [{required: true}]}}>
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
                 allowClear
                 onChange={() => {
                   formRef.setFieldsValue({
                     zip: formRef.getFieldValue('zip').toUpperCase()
                   });
                 }}
                 config={{rules: [{required: true}]}}/>
          <></>
        </div>
        <div>
          <TextArea label={t('address')}
                    name={'address'}
                    rows={4}
                    allowClear
                    form={formRef}
                    config={{rules: [{required: true}]}}/>
          <></>
        </div>
      </GenericPanel>
  );
};
