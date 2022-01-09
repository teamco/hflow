import React from 'react';

import { Input } from 'antd';
import FormComponents from 'components/Form';

const { GenericPanel } = FormComponents;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const SubscriptionTranslate = (props) => {
  const {
    t,
    formRef,
    disabled
  } = props;

  return (
      <GenericPanel header={t('subscription:translate')}
                    name={'translate'}
                    defaultActiveKey={['translate']}>
        <div>
          <Input type={'text'}
                 label={t('subscription:title')}
                 name={['translateKeys', 'title']}
                 form={formRef}
                 disabled={disabled}
                 config={{ rules: [{ required: true }] }}/>
          <Input type={'text'}
                 label={t('form:description')}
                 name={['translateKeys', 'description']}
                 form={formRef}
                 disabled={disabled}/>
        </div>
      </GenericPanel>
  );
};
