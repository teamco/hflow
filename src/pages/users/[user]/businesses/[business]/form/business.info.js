import React from 'react';
import { Input, Select } from 'antd';
import { useIntl } from 'umi';
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
  formRef,
  businessTypes,
  disabled,
  uploadLogo
}) => {
  const intl = useIntl();
  return (
      <GenericPanel header={intl.formatMessage({id: 'business.info', defaultMessage: 'Business Information'})}
                    name={'info'}
                    defaultActiveKey={['info']}>
        <div>
          <Select name={'businessType'}
                  form={formRef}
                  label={intl.formatMessage({id: 'business.type', defaultMessage: 'Business Type'})}
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
                 label={intl.formatMessage({id: 'business.name', defaultMessage: 'Legal Business Name'})}
                 name={'name'}
                 form={formRef}
                 disabled={disabled}
                 config={{ rules: [{ required: true }] }}/>
          <Input type={'text'}
                 label={intl.formatMessage({id: 'business.email', defaultMessage: 'Business Email'})}
                 name={'email'}
                 form={formRef}
                 disabled={disabled}
                 config={{ ...emailProps(t) }}/>
        </div>
        <div>
          <TextArea type={'text'}
                    label={intl.formatMessage({id: 'form.description', defaultMessage: 'Description'})}
                    name={'description'}
                    rows={4}
                    showCount
                    maxLength={300}
                    disabled={disabled}
                    form={formRef}/>
          <UploadFile label={intl.formatMessage({id: 'business.logo', defaultMessage: 'Business Logo'})}
                      name={'logo'}
                      disabled={disabled}
                      {...uploadLogo}
                      form={formRef}/>
        </div>
      </GenericPanel>
  );
};
