import React from 'react';
import {DatePicker, Input} from 'antd';

import {emailProps} from 'components/partials/email.partial';
import FormComponents from 'components/Form';
import UploadFile from 'components/Upload';

const {GenericPanel} = FormComponents;
const {TextArea} = Input;

/**
 * @export
 * @param t
 * @param formRef
 * @param upload
 * @param {boolean} disabled
 * @return {JSX.Element}
 * @constructor
 */
export const BusinessInfo = ({
  t,
  formRef,
  disabled,
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
                 disabled={disabled}
                 config={{rules: [{required: true}]}}/>
          <Input type={'text'}
                 label={t('business:email')}
                 name={'email'}
                 form={formRef}
                 disabled={disabled}
                 config={{...emailProps(t)}}/>
        </div>
        <div>
          <TextArea type={'text'}
                    label={t('form:description')}
                    name={'description'}
                    rows={4}
                    showCount
                    maxLength={300}
                    disabled={disabled}
                    form={formRef}/>
          <UploadFile label={t('business:logo')}
                      name={'logo'}
                      disabled={disabled}
                      {...uploadLogo}
                      form={formRef}/>
        </div>
      </GenericPanel>
  );
};
