import React from 'react';
import { DatePicker, Input } from 'antd';
import countryCodes from 'country-codes-list';

import { emailProps } from 'components/partials/email.partial';
import FormComponents from 'components/Form';
import UploadFile from 'components/Upload';
import Phone from 'components/Form/phone';

const { GenericPanel } = FormComponents;
const { TextArea } = Input;

/**
 * @constant
 * @param formRef
 * @return {{currencyNameEn, flag, tinType, officialLanguageNameEn, countryNameEn,
 *   countryCallingCode, countryCode, tinName, officialLanguageCode,
 *   countryNameLocal, officialLanguageNameLocal, region, currencyCode}}
 */
export const getSelectedCountry = formRef => {
  const country = formRef.getFieldValue('country');
  return countryCodes.findOne('countryCode', country) || {};
};

/**
 * @export
 * @param t
 * @param formRef
 * @param upload
 * @return {JSX.Element}
 * @constructor
 */
export const BusinessInfo = ({
  t,
  formRef,
  upload
}) => {
  return (
    <GenericPanel header={t('business:info')}
                  name={'info'}
                  defaultActiveKey={['info']}>
      <div>
        <Input type={'text'}
               label={t('business:name')}
               name={'name'}
               form={formRef}
               config={{ rules: [{ required: true }] }} />
        <Input type={'text'}
               label={t('business:email')}
               name={'email'}
               form={formRef}
               config={{ ...emailProps(t) }} />
      </div>
      <div>
        <TextArea type={'text'}
                  label={t('form:description')}
                  name={'description'}
                  rows={4}
                  form={formRef} />
        <div />
      </div>
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
        <UploadFile label={t('business:license')}
                    name={'license'}
                    {...upload}
                    form={formRef} />
        <DatePicker label={t('business:licenseExpiration')}
                    name={'licenseExpiration'}
                    form={formRef} />
      </div>
    </GenericPanel>
  );
};
