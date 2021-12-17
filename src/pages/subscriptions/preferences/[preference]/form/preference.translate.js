import React, { useEffect, useState } from 'react';

import { Input, InputNumber, Select, Slider, Switch } from 'antd';
import FormComponents from 'components/Form';

const { GenericPanel, MandatoryTextarea } = FormComponents;
const { Option } = Select;

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
                 disabled={disabled}
                 config={{ rules: [{ required: false }] }} />
        </div>
        <div>
          <Input type={'text'}
                 label={t('preference:translateOn')}
                 name={'translateOn'}
                 form={formRef}
                 disabled={disabled}
                 config={{ rules: [{ required: false }] }} />

          <Input type={'text'}
                 label={t('preference:translateOff')}
                 name={'translateOff'}
                 form={formRef}
                 disabled={disabled}
                 config={{ rules: [{ required: false }] }} />
        </div>
      </GenericPanel>
  );
};
