import React from 'react';
import { DatePicker } from 'antd';

import FormComponents from 'components/Form';
import UploadFile from 'components/Upload';

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
  t,
  formRef,
  disabled,
  uploadLicense
}) => {
  return (
    <GenericPanel header={t('business:license')}
                  name={'license'}>
      <div>
        <UploadFile label={t('business:subLicense')}
                    name={'license'}
                    disabled={disabled}
                    {...uploadLicense}
                    form={formRef} />
        <DatePicker label={t('business:licenseExpiration')}
                    name={'licenseExpiration'}
                    disabled={disabled}
                    form={formRef} />
      </div>
    </GenericPanel>
  );
};
