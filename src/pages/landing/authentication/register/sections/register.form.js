import React, { useState } from 'react';
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Spin,
  Tooltip
} from 'antd';
import {
  FormOutlined,
  LockTwoTone,
  LoginOutlined,
  ProfileTwoTone
} from '@ant-design/icons';
import { history, useIntl } from '@umijs/max';

import { EmailPartial } from '@/components/partials/email.partial';
import { requiredField } from '@/components/Form';
import Logo from '@/components/Logo';

import { t } from '@/utils/i18n';
import { isSpinning } from '@/utils/state';
import { stub } from '@/utils/function';

import { onUpdateMeter }
  from '@/pages/landing/authentication/register/sections/meter';
import Strength
  from '@/pages/landing/authentication/register/sections/strength';
import { SocialButtons }
  from '@/pages/landing/authentication/social/social.buttons';

import styles
  from '@/pages/landing/authentication/register/register.module.less';

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const RegisterForm = props => {
  const intl = useIntl();

  const {
    models: {
      authModel,
      landingModel
    },
    onFinish = stub,
    disabled,
    mask = true,
    wrapClassName,
    buttons = [],
    loading
  } = props;

  const {
    MIN_PASSWORD_LENGTH
  } = authModel;

  const logoProps = {
    imgSrc: landingModel.icon,
    className: styles.logo
  };

  const modalHeader = (
      <div className={styles.modalHeader}>
        <h6>{t(intl, 'auth.registerTitle')}</h6>
        <Logo {...logoProps} />
      </div>
  );

  const [meterValue, setMeterValue] = useState(null);
  const [meterText, setMeterText] = useState('');

  const isLoading = isSpinning(loading, ['authModel/signIn']);

  const passConfirmationField = t(intl, 'auth.passwordConfirm');
  const firstNameField = t(intl, 'form.firstName');
  const lastNameField = t(intl, 'form.lastName');
  const passField = t(intl, 'auth.password');

  return (
      <Modal title={modalHeader}
             closable={false}
             width={500}
             centered
             open={true}
             mask={mask}
             wrapClassName={wrapClassName}
             footer={null}>
        <Spin spinning={isSpinning(loading, [
          'authModel/registerData',
          'authModel/handleUserProfile',
          'firebaseModel/signInWithPassword',
          'firebaseModel/signInWithGoogle'
        ])}>
          <Form name={'auth_signup'}
                size={'large'}
                onFinish={onFinish}>
            <Divider plain>
              {t(intl, 'auth.signUpDesc')}
            </Divider>
            <Form.Item>
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item name={'firstName'}
                             style={{ marginBottom: 0 }}
                             rules={[
                               requiredField(intl, firstNameField)
                             ]}>
                    <Input prefix={<ProfileTwoTone/>}
                           placeholder={firstNameField}/>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name={'lastName'}
                             style={{ marginBottom: 0 }}
                             rules={[
                               requiredField(intl, lastNameField)
                             ]}>
                    <Input prefix={<ProfileTwoTone/>}
                           placeholder={lastNameField}/>
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
            <EmailPartial name={'email'}/>
            <Form.Item>
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item name={'password'}
                             hasFeedback
                             extra={t(intl, 'auth.passwordHelper',
                                 { length: MIN_PASSWORD_LENGTH })}
                             onChange={e => onUpdateMeter(
                                 { e, setMeterText, setMeterValue })}
                             rules={[
                               requiredField(intl, passField),
                               ({ getFieldValue }) => ({
                                 validator(_, value) {
                                   if (value &&
                                       getFieldValue('password').length <
                                       MIN_PASSWORD_LENGTH) {
                                     return Promise.reject(
                                         t(intl, 'auth.passwordTooEasy',
                                             { length: MIN_PASSWORD_LENGTH }));
                                   }
                                   return Promise.resolve();
                                 }
                               })
                             ]}>
                    <Input.Password prefix={<LockTwoTone/>}
                                    autoComplete={'new-password'}
                                    placeholder={t(intl, 'auth.password')}/>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name={'password_confirm'}
                             dependencies={['password']}
                             hasFeedback
                             rules={[
                               requiredField(intl, passConfirmationField),
                               ({ getFieldValue }) => ({
                                 validator(_, value) {
                                   if (!value ||
                                       getFieldValue('password') === value) {
                                     return Promise.resolve();
                                   }

                                   return Promise.reject(
                                       t(intl, 'auth.passwordConfirmNotValid'));
                                 }
                               })
                             ]}>
                    <Input.Password prefix={<LockTwoTone/>}
                                    autoComplete={'new-password'}
                                    placeholder={t(intl,
                                        'auth.passwordConfirm')}/>
                  </Form.Item>
                </Col>
              </Row>
              <Strength className={styles.passwordStrength}
                        meterValue={meterValue}
                        meterText={meterText}/>
            </Form.Item>
            <Form.Item>
              <Row gutter={[16, 16]}
                   className={styles.loginBtns}>
                <Col span={12}>
                  <Tooltip title={t(intl, 'auth.registerTitle')}>
                    <Button type={'primary'}
                            size={'default'}
                            htmlType={'submit'}
                            block
                            loading={isLoading}
                            icon={<FormOutlined/>}>
                      {t(intl, 'auth.register')}
                    </Button>
                  </Tooltip>
                </Col>
                <Col span={12}>
                  <Tooltip title={t(intl, 'auth.signInTitle')}>
                    <Button type={'default'}
                            icon={<LoginOutlined/>}
                            size={'default'}
                            disabled={disabled}
                            block
                            loading={isLoading}
                            onClick={() => history.push('/login')}>
                      {t(intl, 'auth.signIn')}
                    </Button>
                  </Tooltip>
                </Col>
              </Row>
            </Form.Item>
            <SocialButtons disabled={disabled}
                           spinning={isLoading}
                           buttons={buttons}/>
          </Form>
        </Spin>
      </Modal>
  );
};

export default RegisterForm;
