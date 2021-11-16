import React from 'react';
import { MailTwoTone } from '@ant-design/icons';
import { Form, Input } from 'antd';

/**
 * @export
 * @param t
 * @return {{extra, rules: [{type: string, message: *}, {message: *, required: boolean}]}}
 */
export const emailProps = t => ({
  extra: t('auth:emailHelper'),
  rules: [
    { type: 'email', message: t('auth:emailNotValid') },
    { required: true, message: t('form:required', { field: t('auth:email') }) }
  ]
});

/**
 * @export
 * @param t
 * @param name
 * @param className
 * @param emailRef
 * @return {JSX.Element}
 */
export const emailPartial = ({ t, name, className, emailRef }) => {
  return (
      <Form.Item name={name}
                 className={className}
                 {...emailProps(t)}>
        <Input prefix={<MailTwoTone/>}
               ref={emailRef}
               autoComplete={'off'}
               placeholder={t('auth:email')}/>
      </Form.Item>
  );
};
