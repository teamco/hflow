import React from 'react';
import { Input, Select } from 'antd';
import { useIntl } from '@umijs/max';
import { emailProps } from '@/components/partials/email.partial';
import FormComponents from '@/components/Form';
import UploadFile from '@/components/Upload';
import { sortBy } from '@/utils/array';
import { t } from '@/utils/i18n';

const { GenericPanel } = FormComponents;
const { TextArea } = Input;
const { Option } = Select;

/**
 * @export
 * @param formRef
 * @param businessTypes
 * @param {boolean} disabled
 * @param uploadLogo
 * @return {JSX.Element}
 * @constructor
 */
export const BusinessInfo = ({
  formRef,
  businessTypes,
  disabled,
  uploadLogo
}) => {
  const intl = useIntl();

  return (
      <GenericPanel header={t(intl, 'business.info')}
                    name={'info'}
                    defaultActiveKey={['info']}>
        <div>
          <Select name={'businessType'}
                  form={formRef}
                  label={t(intl, 'business.type')}
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
                 label={t(intl, 'business.name')}
                 name={'name'}
                 form={formRef}
                 disabled={disabled}
                 config={{ rules: [{ required: true }] }}/>
          <Input type={'text'}
                 label={t(intl, 'business.email')}
                 name={'email'}
                 form={formRef}
                 disabled={disabled}
                 config={{ ...emailProps() }}/>
        </div>
        <div>
          <TextArea type={'text'}
                    label={t(intl, 'form.description')}
                    name={'description'}
                    rows={4}
                    showCount
                    maxLength={300}
                    disabled={disabled}
                    form={formRef}/>
          <UploadFile label={t(intl, 'business.logo')}
                      name={'logo'}
                      disabled={disabled}
                      {...uploadLogo}
                      form={formRef}/>
        </div>
      </GenericPanel>
  );
};
