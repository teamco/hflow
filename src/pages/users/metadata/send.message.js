import React, { useState } from 'react';
import { Button, Form, Input, Modal, Switch } from 'antd';
import { MailOutlined, MessageTwoTone } from '@ant-design/icons';
import { useIntl } from 'umi';

import HiddenField from '@/components/Form/HiddenField';

import styles from '@/pages/users/users.module.less';

/**
 * @export
 * @constant
 * @param props
 */
const SendMessage = (props) => {
  const intl = useIntl();
  const {
    onSendMessage,
    visibleMessage,
    setVisibleMessage
  } = props;

  const [sendDisabled, setSendDisabled] = useState(true);
  const [fields, setFields] = useState({});

  /**
   * @constant
   * @param values
   */
  const onFinish = values => {
    onSendMessage(visibleMessage, values);
    onCancel();
  };

  /** @constant */
  const onCancel = () => {
    setVisibleMessage({ visible: false, props: {} });
    setSendDisabled(true);
  };

  /**
   * @constant
   * @param field
   * @param {number} [count]
   */
  const handleSend = (field, count = 2) => {
    const _fields = { ...fields, ...field };
    const values = Object.values(_fields).filter(v => !!v);
    setFields(_fields);
    setSendDisabled(values.length !== count);
  };

  const [form] = Form.useForm();

  const { from, to, replyTo } = visibleMessage.props;

  return (
      <Modal visible={visibleMessage.visible}
             title={(
                 <div className={styles.sendMessage}>
                   <MessageTwoTone/>
                   {t('auth:sendMessage')}
                 </div>
             )}
             footer={[
               <Button key={'back'}
                       onClick={onCancel}>
                 {intl.formatMessage({id: 'actions.cancel', defaultMessage: 'Cancel'})}
               </Button>,
               <Button key={'submit'}
                       type={'primary'}
                       icon={<MailOutlined/>}
                       disabled={sendDisabled}
                       onClick={() => {
                         form.validateFields().then((values) => {
                           form.resetFields();
                           onFinish(values);
                         }).catch((info) => {
                           console.warn('Validate Failed:', info);
                         });
                       }}>
                 {intl.formatMessage({id: 'actions.sendMessage', defaultMessage: 'Send Message'})}
               </Button>
             ]}>
        <Form form={form}
              layout={'vertical'}
              name={'sendMessage'}
              initialValues={{
                isPrivate: true,
                from: from?.email,
                to: to?.email,
                replyTo: replyTo?.id
              }}>
          <Form.Item label={intl.formatMessage({id: 'notifications.to', defaultMessage: 'To'})}
                     name={'to'}>
            <Input disabled/>
          </Form.Item>
          <Form.Item label={intl.formatMessage({id: 'notifications.from', defaultMessage: 'From'})}
                     name={'from'}>
            <Input disabled/>
          </Form.Item>
          {replyTo && (
              <HiddenField label={intl.formatMessage({id: 'notifications.re', defaultMessage: 'Re: {sender'}, {sender: replyTo})}
                           name={'replyTo'}/>
          )}
          <Form.Item label={intl.formatMessage({id: 'table.title', defaultMessage: 'Title'})}
                     tooltip={intl.formatMessage({id: 'form.required', defaultMessage: '{field} is required'}, { field: intl.formatMessage({id: 'table.title', defaultMessage: 'Title'}) })}
                     name={'title'}>
            <Input onChange={e => handleSend({ title: e.target.value })}/>
          </Form.Item>
          <Form.Item label={intl.formatMessage({id: 'table.description', defaultMessage: 'Description'})}
                     tooltip={intl.formatMessage({id: 'form.required', defaultMessage: '{field} is required'}, { field: t('table:description') })}
                     name={'description'}>
            <Input.TextArea type={'textarea'}
                            onChange={e => handleSend({ description: e.target.value })}/>
          </Form.Item>
          <Form.Item name={'isPrivate'}
                     valuePropName={'checked'}>
            <Switch checkedChildren={intl.formatMessage({id: 'notifications.private', defaultMessage: 'Private'})}
                    unCheckedChildren={intl.formatMessage({id: 'notifications.public', defaultMessage: 'Public'})}
                    defaultChecked/>
          </Form.Item>
        </Form>
      </Modal>
  );
};

export default SendMessage;
