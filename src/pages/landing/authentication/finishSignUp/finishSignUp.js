import React, { useState } from 'react';
import { useIntl, useParams } from '@umijs/max';
import { Form, Input, Layout, Spin } from 'antd';
import {
  LockTwoTone,
  ProfileTwoTone,
  UserAddOutlined
} from '@ant-design/icons';

import { LandingPage } from '@/layouts/landing/page/landing.page.layout';

import { emailProps } from '@/components/partials/email.partial';
import FormComponents from '@/components/Form';
import ErrorModal from '@/components/Authentication/modals/error.modal';

import { effectHook } from '@/utils/hooks';
import { t } from '@/utils/i18n';
import { componentAbilities } from '@/utils/auth/component.setting';

import { onUpdateMeter }
  from '@/pages/landing/authentication/register/sections/meter';
import Strength
  from '@/pages/landing/authentication/register/sections/strength';

import styles
  from '@/pages/landing/authentication/finishSignUp/finishSignUp.module.less';
import stylesAuth from '@/components/Authentication/authentication.module.less';

const { Content } = Layout;
const { GenericPanel } = FormComponents;

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 */
export const finishSignUp = (props) => {
  const intl = useIntl();

  /* These props are provided by withFirebaseAuth HOC */
  const {
    createUserWithEmailAndPassword,
    setError,
    user,
    error
  } = props;

  const {
    loading,
    authModel,
    landingModel,
    businessModel,
    onPrepareRegistration,
    onRegisterData
  } = props;

  const [formRef] = Form.useForm();
  const params = useParams();

  effectHook(() => {
    onPrepareRegistration(params, intl);
  }, []);

  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [meterValue, setMeterValue] = useState(null);
  const [meterText, setMeterText] = useState('');

  const MIN_PASSWORD_LENGTH = authModel.MIN_PASSWORD_LENGTH;

  const { entityForm } = businessModel;

  const {
    header: { position }
  } = landingModel;

  let errorProps = {};

  if (error) {
    errorProps = {
      title: t(intl, 'error.errorNum', { number: 400 }),
      error
    };

    if (isErrorVisible) {
      // TODO (teamco): Do something.
    } else {
      setIsErrorVisible(true);
    }
  }

  /**
   * @constant
   */
  const handleErrorCancel = () => {
    setIsErrorVisible(false);
    setError(null);
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
      isBusinessUser: true
    });
  };

  const subTitle = (
      <>
        <UserAddOutlined style={{ marginRight: 10 }}/>
        {t(intl, 'business.finishRegisterUser')}
      </>
  );

  const component = 'finish.signup';
  const MODEL_NAME = 'businessModel';
  const {
    ableFor,
    ability,
    disabled,
    canUpdate,
    canDelete,
    canExport
  } = componentAbilities(authModel, component, true);

  const pageHeaderProps = {
    subTitle,
    loading,
    disabled,
    MODEL_NAME,
    component,
    actions: {
      closeBtn: false,
      menuBtn: false,
      newBtn: false,
      exportBtn: false,
      saveBtn: {
        ableFor,
        formRef,
        touched: true,
        title: t(intl, 'auth.register'),
        spinOn: ['businessModel/finishRegistration']
      }
    }
  };

  const contentProps = {
    className: position === 'fixed' ? styles.contentFixed : null
  };

  return (
      <LandingPage spinEffects={['landingModel/query']}>
        <Layout style={{ minHeight: '100vh' }} {...contentProps}>
          <Content className={styles.finishSignUpWrapper}>
            <Spin spinning={!!user}>
              <Form name={'auth_finish_signup'}
                    layout={'vertical'}
                    className={stylesAuth.loginForm}
                    size={'large'}
                    fields={entityForm}
                    form={formRef}
                    onFinish={onFinish}>
                <GenericPanel
                    header={t(intl, 'business.usersDetails')}
                    name={'usersDetails'}
                    defaultActiveKey={['usersDetails']}>
                  <div>
                    <Input type={'text'}
                           label={t(intl, 'business.invitedByUser')}
                           disabled={true}
                           name={'invitedByUser'}
                           form={formRef}/>
                    <Input type={'text'}
                           label={t(intl, 'business.assignedTo')}
                           disabled={true}
                           name={'assignedTo'}
                           form={formRef}/>
                  </div>
                  <div>
                    <Input type={'text'}
                           label={t(intl, 'auth.email')}
                           disabled={true}
                           name={'email'}
                           form={formRef}
                           config={{ ...emailProps() }}/>
                    <Input type={'text'}
                           label={t(intl, 'business.userRoles')}
                           disabled={true}
                           name={'userRoles'}
                           form={formRef}/>
                  </div>
                  <div>
                    <Input prefix={<ProfileTwoTone/>}
                           name={'firstName'}
                           label={t(intl, 'form.firstName')}
                           allowClear={true}
                           form={formRef}
                           config={{ rules: [{ required: true }] }}/>
                    <Input prefix={<ProfileTwoTone/>}
                           name={'lastName'}
                           label={t(intl, 'form.lastName')}
                           allowClear={true}
                           form={formRef}
                           config={{ rules: [{ required: true }] }}/>
                  </div>
                  <div>
                    <Input.Password prefix={<LockTwoTone/>}
                                    name={'password'}
                                    label={t(intl, 'auth.password')}
                                    form={formRef}
                                    autoComplete={'new-password'}
                                    extra={t(intl, 'auth.passwordHelper',
                                        { length: MIN_PASSWORD_LENGTH })}
                                    onChange={e => onUpdateMeter(
                                        { e, setMeterValue, setMeterText })}
                                    config={{
                                      rules: [
                                        { required: true },
                                        ({ getFieldValue }) => ({
                                          validator(_, value) {
                                            if (value &&
                                                getFieldValue(
                                                    'password').length <
                                                MIN_PASSWORD_LENGTH) {
                                              return Promise.reject(
                                                  t(intl,
                                                      'auth.passwordTooEasy',
                                                      { length: MIN_PASSWORD_LENGTH }));
                                            }
                                            return Promise.resolve();
                                          }
                                        })
                                      ]
                                    }}/>
                    <Input.Password prefix={<LockTwoTone/>}
                                    name={'password_confirm'}
                                    label={t(intl, 'auth.passwordConfirm')}
                                    form={formRef}
                                    autoComplete={'new-password'}
                                    extra={t(intl, 'auth.passwordHelper',
                                        { length: MIN_PASSWORD_LENGTH })}
                                    onChange={e => onUpdateMeter(
                                        { e, setMeterValue, setMeterText })}
                                    config={{
                                      rules: [
                                        { required: true },
                                        ({ getFieldValue }) => ({
                                          validator(_, value) {
                                            if (!value ||
                                                getFieldValue('password') ===
                                                value) {
                                              return Promise.resolve();
                                            }

                                            return Promise.reject(t(intl,
                                                'auth.passwordConfirmNotValid'));
                                          }
                                        })
                                      ]
                                    }}/>
                  </div>
                  <div>
                    <Strength className={stylesAuth.passwordStrength}
                              meterValue={meterValue}
                              meterText={meterText}/>
                  </div>
                </GenericPanel>
              </Form>
              <ErrorModal errorProps={errorProps}
                          isErrorVisible={isErrorVisible}
                          handleErrorCancel={handleErrorCancel}/>
            </Spin>
          </Content>
        </Layout>
      </LandingPage>
  );
};
