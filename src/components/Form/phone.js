import React from 'react';
import { Form, Input } from 'antd';
import countryCodes from 'country-codes-list';

import { getSuffix } from './index';
import { effectHook } from '@/utils/state';

/**
 * @export
 * @default
 * @constant
 * @param t
 * @param label
 * @param name
 * @param formRef
 * @param required
 * @param {boolean} disabled
 * @param countryData
 * @return {JSX.Element}
 */
const phone = ({
  t,
  label,
  name = 'phone',
  formRef,
  required,
  disabled,
  countryData
}) => {

  effectHook(() => {
    countryData.countryCallingCode && formRef.setFieldsValue({
      phone: { code: `+${countryData.countryCallingCode || ''}` }
    });

  }, [countryData]);

  /**
   * @constant
   * @param e
   */
  const updateCountryName = e => {
    const value = e.target.value.replace(/\+/, '');
    const code = countryCodes.findOne('countryCallingCode', value);
    formRef.setFieldsValue({ country: code?.countryCode });
  };

  return (
      <Input.Group compact
                   label={label}>
        <Form.Item name={[name, 'code']} noStyle>
          {/*<Tooltip trigger={['click']}*/}
          {/*         title={t('address:selectCountry')}*/}
          {/*         placement={'topLeft'}>*/}
          <Input type={'text'}
                 disabled={disabled}
                 style={{ width: '19%' }}
                 readOnly={true}
                 hidden={true}
                 onChange={updateCountryName}
                 placeholder={t('address:code')}/>
          {/*</Tooltip>*/}
        </Form.Item>
        <Form.Item name={[name, 'area']}
                   noStyle
                   rules={[
                     {
                       required,
                       message: t('form:required', { field: t('address:area') })
                     },
                     ({ getFieldValue }) => ({
                       validator(_, value = '') {
                         return value.match(/^\d+$/) ?
                             Promise.resolve() :
                             Promise.reject(t('business:formError', { type: t('address:area') }));
                       }
                     })
                   ]}>
          <Input type={'text'}
                 disabled={disabled}
                 style={{ width: '20%' }}
                 placeholder={t('address:area')}/>
        </Form.Item>
        <Form.Item name={[name, 'number']}
                   noStyle
                   rules={[
                     {
                       required,
                       message: t('form:required', { field: t('auth:phone') })
                     },
                     ({ getFieldValue }) => ({
                       validator(_, value = '') {
                         return value.match(/^\d+$/) ?
                             Promise.resolve() :
                             Promise.reject(t('business:formError', { type: t('address:phone') }));
                       }
                     })
                   ]}>
          <Input type={'text'}
                 disabled={disabled}
                 style={{ width: '63%' }}
                 placeholder={t('address:phone')}
                 suffix={getSuffix(t, formRef, 'phone.number', t('address:phone'))}/>
        </Form.Item>
        <Form.Item name={[name, 'ext']}
                   noStyle
                   rules={[
                     ({ getFieldValue }) => ({
                       validator(_, value) {
                         return !value || value.match(/^\d+$/) ?
                             Promise.resolve() :
                             Promise.reject(t('business:formError', { type: t('address:ext') }));
                       }
                     })
                   ]}>
          <Input type={'text'}
                 disabled={disabled}
                 style={{ width: '17%' }}
                 placeholder={t('address:ext')}/>
        </Form.Item>
      </Input.Group>
  );
};

export default phone;
