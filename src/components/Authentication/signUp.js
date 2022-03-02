import React, { useState } from 'react';
import { Button, Col, Form, Input, message, Modal, Row, Tooltip } from 'antd';
import { useIntl } from 'umi';
import { FormOutlined, LockTwoTone, LoginOutlined, ProfileTwoTone } from '@ant-design/icons';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { onUpdateMeter } from '@/components/Authentication/methods/meter';
import { emailPartial } from '@/components/partials/email.partial';

import styles from '@/components/Authentication/authentication.module.less';

import Strength from '@/components/Authentication/strength';
import { isLoading } from '@/utils/state';
import { effectHook } from '@/utils/hooks';


export const signUp = props => {
  const intl = useIntl();
  /* These props are provided by withFirebaseAuth HOC */
  const {
    isRegisterVisible,
    setIsRegisterVisible,
    setIsSignInVisible,
    createUserWithEmailAndPassword,
    user,
    error,
    loading
  } = props;

  const {
    MIN_PASSWORD_LENGTH,
    registerData,
    signInVisible,
    onRefresh,
    onSignIn,
    isSignInAble = true,
    onRegisterData
  } = props;

  const [meterValue, setMeterValue] = useState(null);
  const [meterText, setMeterText] = useState('');

  effectHook(() => {
    if (user && Object.keys(registerData).length) {
      onSignIn(user);
      handleCancel();
    }
  }, [user]);

  if (error) {
    message.error(error).then();
  }

  const handleCancel = () => {
    setIsRegisterVisible(false);
  };

  /**
   * @constant
   * @param values
   */
  const onFinish = values => {
    createUserWithEmailAndPassword(values.email, values.password);
    onRegisterData({
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      isBusinessUser: false
    });
  };

  const modalHeader = (
      <div className={styles.modalHeader}>
        <div className={styles.icon}><FontAwesomeIcon icon={faUserCircle}/></div>
        <h4>{intl.formatMessage({id: 'auth.signUpTitle', defaultMessage: 'Sign up to create an account'})}</h4>
        <h6>{intl.formatMessage({id: 'auth.signUpDesc', defaultMessage: 'Enter your credentials below'})}</h6>
      </div>
  );

  return (
      <div className={styles.authWrapper}>
        <>
          <Modal title={modalHeader}
                 visible={isRegisterVisible}
                 destroyOnClose={true}
                 closable={!signInVisible}
                 className={styles.authModal}
                 onCancel={handleCancel}
                 maskClosable={false}
                 centered
                 maskStyle={signInVisible ? { backgroundColor: 'rgba(0, 0, 0, 0.45)' } : null}
                 footer={null}>
            <Form name={'auth_signup'}
                  className={styles.loginForm}
                  size={'large'}
                  onFinish={onFinish}>
              <Form.Item>
                <Row gutter={8}>
                  <Col span={12}>
                    <Form.Item name={'firstName'}
                               style={{ marginBottom: 0 }}
                               rules={[
                                 {
                                   required: true,
                                   message: intl.formatMessage({id: 'form.required', defaultMessage: '{field} is' +
                                         ' required'}, { field: intl.formatMessage({id: 'form.firstName', defaultMessage: 'First Name'}) })
                                 }
                               ]}>
                      <Input prefix={<ProfileTwoTone/>}
                             placeholder={intl.formatMessage({id: 'form.firstName', defaultMessage: 'First Name'})}/>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name={'lastName'}
                               style={{ marginBottom: 0 }}
                               rules={[
                                 {
                                   required: true,
                                   message: intl.formatMessage({id: 'form.required', defaultMessage: '{field} is' +
                                         ' required'}, { field: intl.formatMessage({id: 'form.lastName', defaultMessage: 'Last Name'}) })
                                 }
                               ]}>
                      <Input prefix={<ProfileTwoTone/>}
                             placeholder={intl.formatMessage({id: 'form.lastName', defaultMessage: 'Last Name'})}/>
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>
              {emailPartial({ t, name: 'email' })}
              <Form.Item>
                <Row gutter={8}>
                  <Col span={12}>
                    <Form.Item name={'password'}
                               hasFeedback
                               extra={intl.formatMessage({id: 'auth.passwordHelper', defaultMessage: 'Use {length} or more characters with a mix of letters, numbers & symbols'}, { length: MIN_PASSWORD_LENGTH })}
                               onChange={e => onUpdateMeter({ e, setMeterText, setMeterValue })}
                               rules={[
                                 {
                                   required: true,
                                   message: intl.formatMessage({id: 'form.required', defaultMessage: '{field} is' +
                                         ' required'}, { field: intl.formatMessage({id: 'auth.password', defaultMessage: 'Password'}) })
                                 },
                                 ({ getFieldValue }) => ({
                                   validator(_, value) {
                                     if (value && getFieldValue('password').length < MIN_PASSWORD_LENGTH) {
                                       return Promise.reject(
                                           intl.formatMessage({id: 'auth.passwordTooEasy',defaultMessage: 'Use {length} characters or more for your password'}, { length: MIN_PASSWORD_LENGTH }));
                                     }
                                     return Promise.resolve();
                                   }
                                 })
                               ]}>
                      <Input.Password prefix={<LockTwoTone/>}
                                      autoComplete={'new-password'}
                                      placeholder={intl.defaultMessage({id: 'auth.password', defaultMessage: 'Password'})}/>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name={'password_confirm'}
                               dependencies={['password']}
                               hasFeedback
                               rules={[
                                 {
                                   required: true,
                                   message: intl.formatMessage({id: 'form.required', defaultMessage: '{field} is' +
                                         ' required'}, { field: intl.formatMessage({id: 'auth.passwordConfirm', defaultMessage: 'Password Confirmation'}) })
                                 },
                                 ({ getFieldValue }) => ({
                                   validator(_, value) {
                                     if (!value || getFieldValue('password') === value) {
                                       return Promise.resolve();
                                     }

                                     return Promise.reject(intl.formatMessage({id: 'auth.passwordConfirmNotValid', defaultMessage: 'The two passwords that you entered do not match'}));
                                   }
                                 })
                               ]}>
                      <Input.Password prefix={<LockTwoTone/>}
                                      autoComplete={'new-password'}
                                      placeholder={intl.formatMessage({id: 'auth.passwordConfirm', defaultMessage: 'Password Confirmation'})}/>
                    </Form.Item>
                  </Col>
                </Row>
                <Strength className={styles.passwordStrength}
                          meterValue={meterValue}
                          meterText={meterText}/>
              </Form.Item>
              <Form.Item style={{ marginBottom: 0, marginTop: 20 }}>
                <Row gutter={[16, 16]}
                     className={styles.loginBtns}>
                  <Col span={12}>
                    <Tooltip title={intl.formatMessage({id: 'auth.registerTitle', defaultMessage: 'Not a member? You can create an account'})}>
                      <Button type={'primary'}
                              size={'default'}
                              htmlType={'submit'}
                              block
                              loading={isLoading(loading)}
                              icon={<FormOutlined/>}>
                        {intl.formatMessage({id: 'auth.register', defaultMessage: 'Register'})}
                      </Button>
                    </Tooltip>
                  </Col>
                  {isSignInAble && (
                      <Col span={12}>
                        <Tooltip title={intl.formatMessage({id: 'auth.signInTitle', defaultMessage: 'Login to your account'})}>
                          <Button type={'default'}
                                  icon={<LoginOutlined/>}
                                  size={'default'}
                                  block
                                  loading={isLoading(loading)}
                                  onClick={() => {
                                    setIsSignInVisible(true);
                                    setIsRegisterVisible(false);
                                  }}>
                            {intl.formatMessage({id: 'auth.signIn', defaultMessage: 'Sign in'})}
                          </Button>
                        </Tooltip>
                      </Col>
                  )}
                </Row>
              </Form.Item>
            </Form>
          </Modal>
        </>
      </div>
  );
};
