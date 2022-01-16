import React from 'react';

import { Input } from 'antd';
import FormComponents from 'components/Form';
import { withTranslation } from 'react-i18next';

const { GenericPanel } = FormComponents;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const CommonTranslate = (props) => {
  const {
    t,
    formRef,
    disabled,
    prefix = ['translateKeys']
  } = props;

  const {
    header = t('form:translate'),
    title = t('form:title'),
    description = t('form:description')
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

export default withTranslation()(CommonTranslate);
