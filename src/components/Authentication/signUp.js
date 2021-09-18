import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { withTranslation } from 'react-i18next';
import withFirebaseAuth from 'react-with-firebase-auth';
import { firebaseAppAuth, providers } from 'services/firebase.service';
import { Form, Input, Button, Modal, Row, Col, message, Tooltip } from 'antd';
import {
  LockTwoTone,
  FormOutlined,
  ProfileTwoTone, LoginOutlined
} from '@ant-design/icons';

import { onUpdateMeter } from 'components/Authentication/methods/meter';
import { emailPartial } from 'components/partials/email.partial';

import styles from 'components/Authentication/authentication.module.less';

import Strength from 'components/Authentication/strength';
import { isLoading } from 'utils/state';

/** Create the FirebaseAuth component wrapper */
const createComponentWithAuth = withFirebaseAuth({
  providers,
  firebaseAppAuth
});

const signUp = props => {

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
    t,
    MIN_PASSWORD_LENGTH,
    registerData,
    signInVisible,
    onRefresh,
    onSignIn,
    onRegisterData
  } = props;

  const [meterValue, setMeterValue] = useState(null);
  const [meterText, setMeterText] = useState('');

  useEffect(() => {
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
      <div className={styles.icon}><FontAwesomeIcon icon={faUserCircle} /></div>
      <h4>{t('auth:signUpTitle')}</h4>
      <h6>{t('auth:signUpDesc')}</h6>
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
                                 message: t('form:required', { field: t('form:firstName') })
                               }
                             ]}>
                    <Input prefix={<ProfileTwoTone />}
                           placeholder={t('form:firstName')} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name={'lastName'}
                             style={{ marginBottom: 0 }}
                             rules={[
                               {
                                 required: true,
                                 message: t('form:required', { field: t('form:lastName') })
                               }
                             ]}>
                    <Input prefix={<ProfileTwoTone />}
                           placeholder={t('form:lastName')} />
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
                             extra={t('auth:passwordHelper', { length: MIN_PASSWORD_LENGTH })}
                             onChange={e => onUpdateMeter({ e, setMeterText, setMeterValue })}
                             rules={[
                               {
                                 required: true,
                                 message: t('form:required', { field: t('auth:password') })
                               },
                               ({ getFieldValue }) => ({
                                 validator(_, value) {
                                   if (value && getFieldValue('password').length < MIN_PASSWORD_LENGTH) {
                                     return Promise.reject(t('auth:passwordTooEasy', { length: MIN_PASSWORD_LENGTH }));
                                   }
                                   return Promise.resolve();
                                 }
                               })
                             ]}>
                    <Input.Password prefix={<LockTwoTone />}
                                    placeholder={t('auth:password')} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name={'password_confirm'}
                             dependencies={['password']}
                             hasFeedback
                             rules={[
                               {
                                 required: true,
                                 message: t('form:required', { field: t('auth:passwordConfirm') })
                               },
                               ({ getFieldValue }) => ({
                                 validator(_, value) {
                                   if (!value || getFieldValue('password') === value) {
                                     return Promise.resolve();
                                   }

                                   return Promise.reject(t('auth:passwordConfirmNotValid'));
                                 }
                               })
                             ]}>
                    <Input.Password prefix={<LockTwoTone />}
                                    placeholder={t('auth:passwordConfirm')} />
                  </Form.Item>
                </Col>
              </Row>
              <Strength className={styles.passwordStrength}
                        meterValue={meterValue}
                        meterText={meterText} />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0, marginTop: 20 }}>
              <Row gutter={[16, 16]}
                   className={styles.loginBtns}>
                <Col span={12}>
                  <Tooltip title={t('auth:registerTitle')}>
                    <Button type={'primary'}
                            size={'default'}
                            htmlType={'submit'}
                            block
                            loading={isLoading(loading)}
                            icon={<FormOutlined />}>
                      {t('auth:register')}
                    </Button>
                  </Tooltip>
                </Col>
                <Col span={12}>
                  <Tooltip title={t('auth:signInTitle')}>
                    <Button type={'default'}
                            icon={<LoginOutlined />}
                            size={'default'}
                            block
                            loading={isLoading(loading)}
                            onClick={() => {
                              setIsSignInVisible(true);
                              setIsRegisterVisible(false);
                            }}>
                      {t('auth:signIn')}
                    </Button>
                  </Tooltip>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </Modal>
      </>
    </div>
  );
};

export default connect(
  ({ authModel }) => authModel,
  (dispatch) => ({
    dispatch,
    onRegisterData(registerData) {
      dispatch({ type: 'authModel/registerData', payload: { registerData } });
    },
    onSignOut(user) {
      dispatch({ type: 'authModel/signOut', payload: { user } });
    }
  })
)(withTranslation()(createComponentWithAuth(signUp)));
