import React from 'react';
import { DatePicker, Input } from 'antd';

import { emailProps } from 'components/partials/email.partial';
import FormComponents from 'components/Form';
import UploadFile from 'components/Upload';

const { GenericPanel } = FormComponents;
const { TextArea } = Input;

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
  uploadLogo
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
        <UploadFile label={t('business:logo')}
                    name={'logo'}
                    {...uploadLogo}
                    form={formRef} />
      </div>
    </GenericPanel>
  );
};
