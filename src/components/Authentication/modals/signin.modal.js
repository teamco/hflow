import React from 'react';
import { Button, Col, Divider, Form, Input, Modal, Row, Tooltip } from 'antd';
import { FormOutlined, LockTwoTone, LoginOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';
import { emailPartial } from '@/components/partials/email.partial';

import styles from '@/components/Authentication/authentication.module.less';

import { isLoading } from '@/utils/state';

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const SignInModal = props => {
  const intl = useIntl();
  const {
    isSignInVisible,
    signInVisible,
    closable,
    handleCancel,
    authModel,
    onFinish,
    loading,
    setIsSignInVisible,
    setIsRegisterVisible,
    buttons: {
      _googleBtn,
      _twitterBtn
    }
  } = props;

  const modalHeader = (
      <div className={styles.modalHeader}>
        <h4>{intl.formatMessage({id: 'auth.signInTitle', defaultMessage: 'Login to your account'})}</h4>
        <h6>{intl.formatMessage({id: 'auth.signInDesc', defaultMessage: 'Sign in today for more experience'})}</h6>
      </div>
  );

  return (
      <Modal title={modalHeader}
             destroyOnClose={true}
             visible={isSignInVisible}
             closable={closable || !signInVisible}
             onCancel={handleCancel}
             className={styles.authModal}
             width={350}
             centered
             maskStyle={signInVisible ? { backgroundColor: 'rgba(0, 0, 0, 0.45)' } : null}
             footer={null}>
        <Form name={'auth_login'}
              className={styles.loginForm}
              size={'large'}
              onFinish={onFinish}>
          {emailPartial({ t, name: 'email' })}
          <Form.Item name={'password'}
                     extra={intl.formatMessage({id: 'auth.passwordHelper', defaultMessage: 'Use {length} or more characters with a mix of letters, numbers & symbols'}, { length: authModel.MIN_PASSWORD_LENGTH })}
                     rules={[
                       {
                         required: true,
                         message: intl.formatMessage({id: 'form.required', defaultMessage: '{field} is required'}, { field: intl.formatMessage({id: 'auth.password', defaultMessage: 'Password'}) })
                       }
                     ]}>
            <Input.Password prefix={<LockTwoTone/>}
                            autoComplete={'new-password'}
                            placeholder={intl.formatMessage({id: 'auth.password', defaultMessage: 'Password'})}/>
          </Form.Item>
          <Form.Item>
            <Row gutter={[16, 16]}
                 className={styles.loginBtns}>
              <Col span={12}>
                <Tooltip title={intl.formatMessage({id: 'auth.signInTitle', defaultMessage: 'Login to your account'})}>
                  <Button type={'primary'}
                          htmlType={'submit'}
                          icon={<LoginOutlined/>}
                          size={'default'}
                          block
                          loading={isLoading(loading)}>
                    {intl.formatMessage({id: 'auth.signIn', defaultMessage: 'Sign in'})}
                  </Button>
                </Tooltip>
              </Col>
              <Col span={12}>
                <Tooltip title={intl.formatMessage({id: 'auth.registerTitle', defaultMessage: 'Not a member? You can create an account'})}>
                  <Button type={'default'}
                          size={'default'}
                          block
                          onClick={() => handleCancel(() => {
                            setIsSignInVisible(false);
                            setIsRegisterVisible(true);
                          })}
                          loading={isLoading(loading)}
                          icon={<FormOutlined/>}>
                    {intl.formatMessage({id: 'auth.register', defaultMessage: 'Register'})}
                  </Button>
                </Tooltip>
              </Col>
            </Row>
          </Form.Item>
          <Divider plain>{intl.formatMessage({id: 'auth.signInWith', defaultMessage: 'Sign in with {provider}'}, { provider: null })}</Divider>
          <Form.Item style={{ marginBottom: 0 }}>
            <Row gutter={[16, 16]}
                 className={styles.loginBtns}>
              <Col span={8}>{_googleBtn}</Col>
              <Col span={8}>{_twitterBtn}</Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
  );
};

export default SignInModal;
