import React from 'react';
import {Form, Input, Modal, Radio} from 'antd';
import {withTranslation} from 'react-i18next';

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

  /**
   * @constant
   * @param formValues
   */
  const onFinish = formValues => {
    onSendMessage(formValues);
    setVisibleMessage(false);
  };

  const onCancel = () => {
    setVisibleMessage(false);
  };

  const [form] = Form.useForm();

  return (
      <Modal visible={visibleMessage}
             title={t('auth:sendMessage')}
             okText={t('actions:sendMessage')}
             cancelText={t('actions:cancel')}
             onCancel={onCancel}
             onOk={() => {
               debugger
               form.validateFields().then((values) => {
                 form.resetFields();
                 onSendMessage(values);
               }).catch((info) => {
                 console.warn('Validate Failed:', info);
               });
             }}>
        <Form form={form}
              layout={'vertical'}
              name={'sendMessage'}
              initialValues={{
                modifier: 'private'
              }}>
          <Form.Item label={t('table:title')}
                     name={'title'}>
            <Input/>
          </Form.Item>
          <Form.Item label={t('table:description')}
                     name={'description'}>
            <Input.TextArea type="textarea"/>
          </Form.Item>
          <Form.Item name={'modifier'}>
            <Radio.Group>
              <Radio value={'public'}>{t('notifications:public')}</Radio>
              <Radio value={'private'}>{t('notifications:private')}</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
  );
};

export default withTranslation()(SendMessage);
