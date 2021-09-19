import { getSuffix } from './index';
import React, { useEffect } from 'react';
import { Form, Input } from 'antd';

/**
 * @export
 * @default
 * @constant
 * @param t
 * @param label
 * @param name
 * @param formRef
 * @param required
 * @param countryData
 * @return {JSX.Element}
 */
const phone = ({
  t,
  label,
  name = 'phone',
  formRef,
  required,
  countryData
}) => {

  useEffect(() => {
    formRef.setFieldsValue({
      phone: {code: `+${countryData.countryCallingCode}`}
    });

  }, [countryData]);

  return (
    <Input.Group compact
                 label={label}>
      <Form.Item name={[name, 'code']}
                 noStyle>
        <Input type={'text'}
               style={{ width: '18%' }}
               readOnly={true}
               placeholder={t('address:code')} />
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
               style={{ width: '20%' }}
               placeholder={t('address:area')} />
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
               style={{ width: '45%' }}
               placeholder={t('address:phone')}
               suffix={getSuffix(t, formRef, 'phone.number', t('address:phone'))} />
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
               style={{ width: '17%' }}
               placeholder={t('address:ext')} />
      </Form.Item>
    </Input.Group>
  );
};

export default phone;
