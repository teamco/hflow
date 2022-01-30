import React from 'react';
import { Input, Select } from 'antd';

import { emailProps } from '@/components/partials/email.partial';
import FormComponents from '@/components/Form';
import UploadFile from '@/components/Upload';
import { sortBy } from '@/utils/array';

const { GenericPanel } = FormComponents;
const { TextArea } = Input;
const { Option } = Select;

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
  businessTypes,
  disabled,
  uploadLogo
}) => {
  return (
      <GenericPanel header={t('business:info')}
                    name={'info'}
                    defaultActiveKey={['info']}>
        <div>
          <Select name={'businessType'}
                  form={formRef}
                  label={t('business:type')}
                  disabled={disabled}
                  config={{ rules: [{ required: true }] }}>
            {sortBy(businessTypes, 'name').map((type, idx) => (
                <Option key={idx}
                        value={type}>
                  {type}
                </Option>
            ))}
          </Select>
          <></>
        </div>
        <div>
          <Input type={'text'}
                 label={t('business:name')}
                 name={'name'}
                 form={formRef}
                 disabled={disabled}
                 config={{ rules: [{ required: true }] }}/>
          <Input type={'text'}
                 label={t('business:email')}
                 name={'email'}
                 form={formRef}
                 disabled={disabled}
                 config={{ ...emailProps(t) }}/>
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
