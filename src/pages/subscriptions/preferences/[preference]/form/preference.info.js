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
export const PreferenceInfo = (props) => {
  const {
    t,
    formRef,
    disabled
  } = props;

  return (
      <GenericPanel header={t('preference:info')}
                    name={'info'}
                    defaultActiveKey={['info']}>
        <div>
          <Input type={'text'}
                 label={t('preference:name')}
                 name={'name'}
                 form={formRef}
                 disabled={disabled}
                 config={{ rules: [{ required: true }] }} />

          <Switch label={t('preference:helper')}
                  disabled={disabled}
                  form={formRef}
                  config={{ valuePropName: 'checked' }}
                  checkedChildren={t('actions:yes')}
                  unCheckedChildren={t('actions:no')}
                  name={'helper'}/>

          <Switch label={t('preference:status')}
                  disabled={disabled}
                  form={formRef}
                  config={{ valuePropName: 'checked' }}
                  checkedChildren={t('actions:yes')}
                  unCheckedChildren={t('actions:no')}
                  name={'defaultState'}/>
        </div>
      </GenericPanel>
  );
};
