import React from 'react';
import { DatePicker } from 'antd';
import { useIntl } from '@umijs/max';
import FormComponents from '@/components/Form';
import UploadFile from '@/components/Upload';
import { t } from '@/utils/i18n';

const { GenericPanel } = FormComponents;

/**
 * @export
 * @param t
 * @param formRef
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
      <GenericPanel header={t(intl, 'business.license')}
                    name={'license'}>
        <div>
          <UploadFile label={t(intl, 'business.subLicense')}
                      name={'license'}
                      disabled={disabled}
                      {...uploadLicense}
                      form={formRef}/>
          <DatePicker label={t(intl, 'business.licenseExpiration')}
                      name={'licenseExpiration'}
                      disabled={disabled}
                      form={formRef}/>
        </div>
      </GenericPanel>
  );
};
