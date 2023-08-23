import React from 'react';
import { Form, Input, Space } from 'antd';
// import countryCodes from 'country-codes-list';
import { useIntl } from '@umijs/max';

import { getSuffix, requiredField } from './index';
// import { effectHook } from '@/utils/hooks';
import { stub } from '@/utils/function';
import { t } from '@/utils/i18n';

/**
 * @export
 * @default
 * @constant
 * @param label
 * @param name
 * @param formRef
 * @param required
 * @param {boolean} disabled
 * @param countryData
 * @return {JSX.Element}
 */

const phone = ({
  label,
  name = 'phone',
  formRef,
  required,
  disabled,
  countryData = stub()
}) => {
  const intl = useIntl();

  // effectHook(() => {
    // const _countryData = countryData();
    // _countryData?.countryCallingCode && formRef.setFieldsValue({
    //   phone: { code: `+${_countryData?.countryCallingCode || ''}` }
    // });

  // }, [countryData]);

  /**
   * @constant
   * @param e
   */
  // const updateCountryName = e => {
  //   const value = e.target.value.replace(/\+/, '');
  //   const code = countryCodes.findOne('countryCallingCode', value);
  //   formRef.setFieldsValue({ country: code?.countryCode });
  // };

  const codeField = t(intl, 'address.code');
  const addressAreaField = t(intl, 'address.area');
  const addressPhoneField = t(intl, 'address.phone');
  const addressExtField = t(intl, 'address.ext');
  const authPhoneField = t(intl, 'auth.phone');

  return (
      <Space.Compact
                   label={label}>
        <Form.Item name={[name, 'code']}
                   noStyle
                   rules={[
                       requiredField(intl, codeField, required),
                     ({ getFieldValue }) => ({
                       validator(_, value = '') {
                         return value.match(/^\+\d+$/) ?
                             Promise.resolve() :
                             Promise.reject(t(intl, 'business.formError', { type: codeField }));
                       }
                     })
                   ]}>
          {/*<Tooltip trigger={['click']}*/}
          {/*         title={t('address:selectCountry')}*/}
          {/*         placement={'topLeft'}>*/}
          <Input type={'text'}
                 disabled={disabled}
                 style={{ width: '21%' }}
              // onChange={updateCountryName}
                 placeholder={t(intl, 'address.code')}/>
          {/*</Tooltip>*/}
        </Form.Item>
        <Form.Item name={[name, 'area']}
                   noStyle
                   rules={[
                       requiredField(intl, addressAreaField, required),
                     ({ getFieldValue }) => ({
                       validator(_, value = '') {
                         return value.match(/^\d+$/) ?
                             Promise.resolve() :
                             Promise.reject(t(intl, 'business.formError', { type: addressAreaField }));
                       }
                     })
                   ]}>
          <Input type={'text'}
                 disabled={disabled}
                 style={{ width: '20%' }}
                 placeholder={addressAreaField}/>
        </Form.Item>
        <Form.Item name={[name, 'number']}
                   noStyle
                   rules={[
                   requiredField(intl, authPhoneField, required),
                     ({ getFieldValue }) => ({
                       validator(_, value = '') {
                         return value.match(/^\d+$/) ?
                             Promise.resolve() :
                             Promise.reject(t(intl, 'business.formError', { type: addressPhoneField }));
                       }
                     })
                   ]}>
          <Input type={'text'}
                 disabled={disabled}
                 style={{ width: '42%' }}
                 placeholder={addressPhoneField}
                 suffix={getSuffix(formRef, addressPhoneField, 'phone.number')}/>
        </Form.Item>
        <Form.Item name={[name, 'ext']}
                   noStyle
                   rules={[
                     ({ getFieldValue }) => ({
                       validator(_, value) {
                         return !value || value.match(/^\d+$/) ?
                             Promise.resolve() :
                             Promise.reject(t(intl, 'business.formError', { type: addressExtField }));
                       }
                     })
                   ]}>
          <Input type={'text'}
                 disabled={disabled}
                 style={{ width: '17%' }}
                 placeholder={addressExtField}/>
        </Form.Item>
      </Space.Compact>
  );
};

export default phone;
