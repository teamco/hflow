import React, { useEffect, useState } from 'react';

import { Input } from 'antd';
import FormComponents from 'components/Form';

const { GenericPanel } = FormComponents;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const PreferenceTranslate = (props) => {
  const {
    t,
    formRef,
    disabled
  } = props;

  const showHelper = !!(formRef?.getFieldValue('helper'));
  const [disabledHelper, setDisabledHelper] = useState(!showHelper);

  useEffect(() => {
    setDisabledHelper(!showHelper);
  }, [showHelper]);


  return (
      <GenericPanel header={t('preference:translate')}
                    name={'translate'}
                    defaultActiveKey={['translate']}>
        <div>
          <Input type={'text'}
                 label={t('preference:title')}
                 name={'title'}
                 form={formRef}
                 disabled={disabled}
                 config={{ rules: [{ required: true }] }} />

          <Input type={'text'}
                 label={t('preference:description')}
                 name={'trDescription'}
                 form={formRef}
                 disabled={disabled || disabledHelper}
                 config={{ rules: [{ required: true }] }} />
        </div>
        <div>
          <Input type={'text'}
                 label={t('preference:translateOn')}
                 name={'trOn'}
                 form={formRef}
                 disabled={disabled}
                 config={{ rules: [{ required: true }] }} />

          <Input type={'text'}
                 label={t('preference:translateOff')}
                 name={'trOff'}
                 form={formRef}
                 disabled={disabled}
                 config={{ rules: [{ required: true }] }} />
        </div>
      </GenericPanel>
  );
};
