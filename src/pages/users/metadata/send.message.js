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

  /**
   * @constant
   * @param values
   */
  const onFinish = values => {
    debugger
    onSendMessage(values);
    setVisibleMessage(false);
  };

  const onCancel = () => {
    setVisibleMessage(false);
  };

  const handleSend = (field, value) => {

  };

  const [form] = Form.useForm();

  return (
      <Modal visible={visibleMessage}
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
              initialValues={{modifier: true}}>
          <Form.Item label={t('table:title')}
                     name={'title'}>
            <Input onChange={value => handleSend({title: value})}/>
          </Form.Item>
          <Form.Item label={t('table:description')}
                     name={'description'}>
            <Input.TextArea type={'textarea'}
                            onChange={value => handleSend({description: value})}/>
          </Form.Item>
          <Form.Item name={'modifier'}
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
