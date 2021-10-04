import ErrorModal from 'components/Authentication/modals/error.modal';
import React, { useEffect, useState } from 'react';
import { useParams } from 'umi';
import { Button, Form, Input, PageHeader } from 'antd';
import {
  UserAddOutlined,
  LockTwoTone,
  ProfileTwoTone, SaveOutlined
} from '@ant-design/icons';

import { onUpdateMeter } from 'components/Authentication/methods/meter';
import { emailProps } from 'components/partials/email.partial';

import FormComponents from 'components/Form';
import Strength from 'components/Authentication/strength';
import Page from 'components/Page';

import styles from 'pages/finishSignUp/finishSignUp.module.less';
import stylesAuth from 'components/Authentication/authentication.module.less';

const { GenericPanel } = FormComponents;

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 */
export const finishSignUp = (props) => {

  /* These props are provided by withFirebaseAuth HOC */
  const {
    createUserWithEmailAndPassword,
    setError,
    user,
    error
  } = props;

  const {
    t,
    authModel,
    businessModel,
    loadingModel,
    onPrepareRegistration,
    onRegisterData
  } = props;

  const [formRef] = Form.useForm();
  const params = useParams();

  useEffect(() => {
    onPrepareRegistration(params);
  }, []);

  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [meterValue, setMeterValue] = useState(null);
  const [meterText, setMeterText] = useState('');

  const component = 'finishSignUp';
  const MIN_PASSWORD_LENGTH = authModel.MIN_PASSWORD_LENGTH;

  const { entityForm } = businessModel;

  let errorProps = {};

  if (error) {
    errorProps = {
      title: t('error:errorNum', { number: 400 }),
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
      <UserAddOutlined style={{ marginRight: 10 }} />
      {t('business:finishRegisterUser')}
    </>
  );

  return (
    <Page className={styles.finishSignUp}
          spinEffects={[
            'authModel/signIn',
            'businessModel/prepareRegistration',
            'businessModel/finishRegistration'
          ]}
          component={component}>
      <PageHeader ghost={false}
                  subTitle={subTitle}
                  extra={[
                    <Button key={'save'}
                            size={'small'}
                            loading={loadingModel.effects['businessModel/finishRegistration']}
                            icon={<SaveOutlined />}
                            onClick={() => formRef.submit()}
                            type={'primary'}>
                      {t('auth:register')}
                    </Button>
                  ]} />
      <Form name={'auth_finish_signup'}
            layout={'vertical'}
            className={stylesAuth.loginForm}
            size={'large'}
            fields={entityForm}
            form={formRef}
            onFinish={onFinish}>
        <GenericPanel header={t('business:usersDetails')}
                      name={'usersDetails'}
                      defaultActiveKey={['usersDetails']}>
          <div>
            <Input type={'text'}
                   label={t('business:invitedByUser')}
                   disabled={true}
                   name={'invitedByUser'}
                   form={formRef} />
            <Input type={'text'}
                   label={t('business:assignedTo')}
                   disabled={true}
                   name={'assignedTo'}
                   form={formRef} />
          </div>
          <div>
            <Input type={'text'}
                   label={t('auth:email')}
                   disabled={true}
                   name={'email'}
                   form={formRef}
                   config={{ ...emailProps(t) }} />
            <Input type={'text'}
                   label={t('business:userRoles')}
                   disabled={true}
                   name={'userRoles'}
                   form={formRef} />
          </div>
          <div>
            <Input prefix={<ProfileTwoTone />}
                   name={'firstName'}
                   label={t('form:firstName')}
                   allowClear={true}
                   form={formRef}
                   config={{ rules: [{ required: true }] }} />
            <Input prefix={<ProfileTwoTone />}
                   name={'lastName'}
                   label={t('form:lastName')}
                   allowClear={true}
                   form={formRef}
                   config={{ rules: [{ required: true }] }} />
          </div>
          <div>
            <Input.Password prefix={<LockTwoTone />}
                            name={'password'}
                            label={t('auth:password')}
                            form={formRef}
                            autoComplete={'new-password'}
                            extra={t('auth:passwordHelper', { length: MIN_PASSWORD_LENGTH })}
                            onChange={e => onUpdateMeter({ e, setMeterValue, setMeterText })}
                            config={{
                              rules: [
                                { required: true },
                                ({ getFieldValue }) => ({
                                  validator(_, value) {
                                    if (value && getFieldValue('password').length < MIN_PASSWORD_LENGTH) {
                                      return Promise.reject(t('auth:passwordTooEasy', { length: MIN_PASSWORD_LENGTH }));
                                    }
                                    return Promise.resolve();
                                  }
                                })
                              ]
                            }} />
            <Input.Password prefix={<LockTwoTone />}
                            name={'password_confirm'}
                            label={t('auth:passwordConfirm')}
                            form={formRef}
                            autoComplete={'new-password'}
                            extra={t('auth:passwordHelper', { length: MIN_PASSWORD_LENGTH })}
                            onChange={e => onUpdateMeter({ e, setMeterValue, setMeterText })}
                            config={{
                              rules: [
                                { required: true },
                                ({ getFieldValue }) => ({
                                  validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                      return Promise.resolve();
                                    }

                                    return Promise.reject(t('auth:passwordConfirmNotValid'));
                                  }
                                })
                              ]
                            }} />
          </div>
          <div>
            <Strength className={stylesAuth.passwordStrength}
                      meterValue={meterValue}
                      meterText={meterText} />
          </div>
        </GenericPanel>
      </Form>
      <ErrorModal errorProps={errorProps}
                  isErrorVisible={isErrorVisible}
                  handleErrorCancel={handleErrorCancel} />
    </Page>
  );
};
