import React from 'react';
import { DatePicker } from 'antd';
import { useIntl } from 'umi';
import FormComponents from '@/components/Form';
import UploadFile from '@/components/Upload';

const { GenericPanel } = FormComponents;

/**
 * @export
 * @param t
 * @param formRef
 * @param upload
 * @return {JSX.Element}
 * @constructor
 */
export const BusinessLicense = ({
  formRef,
  disabled,
  uploadLicense
}) => {
  const intl = useIntl();
  return (
      <GenericPanel header={intl.formatMessage({id: 'business.license', defaultMessage: 'Proof of License'})}
                    name={'license'}>
        <div>
          <UploadFile label={intl.formatMessage({id: 'business.subLicense', defaultMessage: 'License'})}
                      name={'license'}
                      disabled={disabled}
                      {...uploadLicense}
                      form={formRef}/>
          <DatePicker label={intl.formatMessage({id: 'business.licenseExpiration', defaultMessage: 'License expiration date'})}
                      name={'licenseExpiration'}
                      disabled={disabled}
                      form={formRef}/>
        </div>
      </GenericPanel>
  );
};
