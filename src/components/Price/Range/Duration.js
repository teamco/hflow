import React from 'react';
import { InputNumber } from 'antd';

const Duration = props => {
  const {t, formRef, disabled, prefix=[]} = props;

  return (
      <div>
        <InputNumber addonBefore={selectDurationBefore}
                     label={t('feature:discount')}
                     name={[...prefix, 'duration']}
                     form={formRef}
                     min={0}
                     disabled={disabled}
                     config={{ rules: [{ required: true }] }}/>
      </div>
  );
}
