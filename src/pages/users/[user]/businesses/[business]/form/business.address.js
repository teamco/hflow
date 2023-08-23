import React from 'react';
import { Input, Select } from 'antd';
import countryCodes from 'country-codes-list';
import { useIntl } from '@umijs/max';

import FormComponents from '@/components/Form';
import { CountryStates } from '@/components/Form/CountryStates';
import { t } from '@/utils/i18n';

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

  const countryProps = {
    formRef,
    disabled,
    onHandleStates,
    countries,
    states
  };

  const businessWebsiteType = t(intl, 'business.website');

  return (
      <GenericPanel header={t(intl, 'business.address')}
                    name={'address'}
                    defaultActiveKey={['address']}>
        <div>
          <Phone label={t(intl, 'business.phone')}
                 formRef={formRef}
                 disabled={disabled}
                 countryData={() => getSelectedCountry(formRef)}
                 required={true}/>
          <Input type={'text'}
                 label={t(intl, 'business.website')}
                 name={'website'}
                 form={formRef}
                 disabled={disabled}
                 config={{
                   rules: [
                     ({ getFieldValue }) => ({
                       validator(_, value) {
                         return !value || value.match(/^http/) ?
                             Promise.resolve() :
                             Promise.reject(t(intl, 'business.formError', { type: businessWebsiteType }));
                       }
                     })
                   ]
                 }}/>
        </div>
        <div>
          <CountryStates {...countryProps}/>
          <Input type={'text'}
                 label={t(intl, 'address.zip')}
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
        </div>
        <div>
          <MandatoryTextarea label={t(intl, 'common.address')}
                             name={'address'}
                             disabled={disabled}
                             form={formRef}
                             config={{ rules: [{ required: true }] }}/>
          <></>
        </div>
      </GenericPanel>
  );
};
