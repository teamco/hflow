import React from 'react';

import { Input } from 'antd';
import FormComponents from '@/components/Form';
import { useIntl } from 'umi';
const { GenericPanel } = FormComponents;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const CommonTranslate = (props) => {
  const intl = useIntl();
  const {
    formRef,
    disabled,
    prefix = ['translateKeys']
  } = props;

  const {
    header = intl.formatMessage({id: 'form.translate', defaultMessage: 'Translate Keys'}),
    title = intl.formatMessage({id: 'form.title', defaultMessage: 'Title'}),
    description = intl.formatMessage({id: 'form.description', defaultMessage: 'Description'})
  } = props;

  return (
      <GenericPanel header={header}
                    name={'translate'}
                    defaultActiveKey={['translate']}>
        <div>
          <Input type={'text'}
                 label={title}
                 name={[...prefix, 'title']}
                 form={formRef}
                 disabled={disabled}
                 config={{ rules: [{ required: true }] }}/>
          <Input type={'text'}
                 label={description}
                 name={[...prefix, 'description']}
                 form={formRef}
                 disabled={disabled}/>
        </div>
      </GenericPanel>
  );
};

export default CommonTranslate;
