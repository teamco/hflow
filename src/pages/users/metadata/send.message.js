import React, {useState} from 'react';
import {Button, Form, Input, Modal, Switch} from 'antd';
import {
  MessageTwoTone,
  MailOutlined
} from '@ant-design/icons';

import {withTranslation} from 'react-i18next';

import styles from 'pages/users/users.module.less';

/**
 * @export
 * @constant
 * @param props
 */
const SendMessage = (props) => {
  const {
    t,
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
    setVisibleMessage({visible: false, props: {}});
    setSendDisabled(true);
  };

  /**
   * @constant
   * @param field
   * @param {number} [count]
   */
  const handleSend = (field, count = 2) => {
    const _fields = {...fields, ...field};
    const values = Object.values(_fields).filter(v => !!v);
    setFields(_fields);
    setSendDisabled(values.length !== count);
  };

  const [form] = Form.useForm();

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
                 {t('actions:cancel')}
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
                 {t('actions:sendMessage')}
               </Button>
             ]}>
        <Form form={form}
              layout={'vertical'}
              name={'sendMessage'}
              initialValues={{
                isPrivate: true,
                from: visibleMessage.props?.from?.displayName,
                to: visibleMessage.props?.to?.displayName
              }}>
          <Form.Item label={t('notifications:to')}
                     name={'to'}>
            <Input disabled/>
          </Form.Item>
          <Form.Item label={t('notifications:from')}
                     name={'from'}>
            <Input disabled/>
          </Form.Item>
          <Form.Item label={t('table:title')}
                     name={'title'}>
            <Input onChange={e => handleSend({title: e.target.value})}/>
          </Form.Item>
          <Form.Item label={t('table:description')}
                     name={'description'}>
            <Input.TextArea type={'textarea'}
                            onChange={e => handleSend({description: e.target.value})}/>
          </Form.Item>
          <Form.Item name={'isPrivate'}
                     valuePropName={'checked'}>
            <Switch checkedChildren={t('notifications:private')}
                    unCheckedChildren={t('notifications:public')}
                    defaultChecked/>
          </Form.Item>
        </Form>
      </Modal>
  );
};

export default withTranslation()(SendMessage);
