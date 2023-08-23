import React, { useState } from 'react';
import {useIntl} from '@umijs/max';
import { Button, Form, Input, Modal, Switch } from 'antd';
import { MailOutlined, MessageTwoTone } from '@ant-design/icons';

import HiddenField from '@/components/Form/HiddenField';

import { logger } from '@/utils/console';
import { t } from '@/utils/i18n';

import styles from '@/pages/users/users.module.less';
import { requiredField } from '@/components/Form';

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

  const titleField = t(intl, 'table.title');
  const descriptionField = t(intl, 'table.description');

  return (
      <Modal open={visibleMessage.visible}
             title={(
                 <div className={styles.sendMessage}>
                   <MessageTwoTone/>
                   {t(intl, 'actions.sendMessage')}
                 </div>
             )}
             footer={[
               <Button key={'back'}
                       onClick={onCancel}>
                 {t(intl, 'actions.cancel')}
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
                           logger({ type: 'warn', log: info });
                         });
                       }}>
                 {t(intl, 'actions.sendMessage')}
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
          <Form.Item label={t(intl, 'notifications.to')}
                     name={'to'}>
            <Input disabled/>
          </Form.Item>
          <Form.Item label={t(intl, 'notifications.from')}
                     name={'from'}>
            <Input disabled/>
          </Form.Item>
          {replyTo && (
              <HiddenField label={t(intl, 'notifications.re', { sender: replyTo })}
                           name={'replyTo'}/>
          )}
          <Form.Item label={t(intl, 'table.title')}
                     tooltip={requiredField(intl, titleField).message}
                     name={'title'}>
            <Input onChange={e => handleSend({ title: e.target.value })}/>
          </Form.Item>
          <Form.Item label={t(intl, 'table.description')}
                     tooltip={requiredField(intl, descriptionField).message}
                     name={'description'}>
            <Input.TextArea type={'textarea'}
                            onChange={e => handleSend({ description: e.target.value })}/>
          </Form.Item>
          <Form.Item name={'isPrivate'}
                     valuePropName={'checked'}>
            <Switch checkedChildren={t(intl, 'notifications.private')}
                    unCheckedChildren={t(intl, 'notifications.public')}
                    defaultChecked/>
          </Form.Item>
        </Form>
      </Modal>
  );
};

export default SendMessage;
