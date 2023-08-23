import React from 'react';
import { MailTwoTone } from '@ant-design/icons';
import { Form, Input, Tag } from 'antd';
import { useIntl } from '@umijs/max';

import { t } from '@/utils/i18n';

import { requiredField } from '@/components/Form';

/**
 * @export
 * @constant
 */
export const emailProps = () => {
  const intl = useIntl();

  const emailField = t(intl, 'auth.email');

  return {
    extra: t(intl, 'auth.emailHelper'),
    rules: [
      {
        type: 'email',
        message: t(intl, 'auth.emailNotValid')
      },
      requiredField(intl, emailField)
    ]
  };
};

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export const EmailPartial = (props) => {
  const intl = useIntl();

  const {
    name,
    disabled = false,
    className,
    emailRef,
    autoComplete = 'off',
    placeholder = t(intl, 'auth.email'),
    prefix = <MailTwoTone/>,
    suffix = null
  } = props;

  return (
      <Form.Item name={name}
                 className={className}
                 {...emailProps()}>
        <Input prefix={prefix}
               suffix={suffix}
               ref={emailRef}
               disabled={disabled}
               autoComplete={autoComplete}
               placeholder={placeholder}/>
      </Form.Item>
  );
};
