import React from 'react';
import { useIntl } from '@umijs/max';
import { InputNumber, Form } from 'antd';

import { t } from '@/utils/i18n';
import { requiredField } from '@/components/Form';

/**
 * @constant
 * @returns {JSX.Element}
 * @constructor
 */
export const AfterBehavior = (props) => {
  const {
    formRef,
    min = 1,
    prefix = [],
    disabled = false,
    required = true
  } = props;

  const intl = useIntl();

  const occurrences = t(intl, 'scheduler.occurrences');

  return (
      <Form.Item noStyle
                 label={occurrences}
                 name={[...prefix, 'range', 'endReason', 'occurrences']}
                 rules={[requiredField(intl, occurrences, required)]}>
        <InputNumber min={min}
                     style={{ width: 'calc(100% - 90px)' }}
                     disabled={disabled}
                     placeholder={t(intl, 'form.placeholder', { field: occurrences })}/>
      </Form.Item>
  );
};