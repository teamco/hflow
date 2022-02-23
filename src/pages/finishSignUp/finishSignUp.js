import ErrorModal from '@/components/Authentication/modals/error.modal';
import React, { useState } from 'react';
import { useParams, useIntl } from 'umi';
import { Button, Form, Input, PageHeader } from 'antd';
import { LockTwoTone, ProfileTwoTone, SaveOutlined, UserAddOutlined } from '@ant-design/icons';

import { onUpdateMeter } from '@/components/Authentication/methods/meter';
import { emailProps } from '@/components/partials/email.partial';

import FormComponents from '@/components/Form';
import Strength from '@/components/Authentication/strength';
import Page from '@/components/Page';

import styles from 'pages/finishSignUp/finishSignUp.module.less';
import stylesAuth from '@/components/Authentication/authentication.module.less';
import { effectHook } from '@/utils/hooks';

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
    t,
    authModel,
    businessModel,
    loadingModel,
    onPrepareRegistration,
    onRegisterData
  } = props;

  const [formRef] = Form.useForm();
  const params = useParams();

  effectHook(() => {
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
      title: intl.formatMessage({id: 'error.errorNum', defaultMessage: 'Error: {number}'}, { number: 400 }),
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
        {intl.formatMessage({id: 'business.finishRegisterUser', defaultMessage: 'Finish your Registration'})}
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
                              icon={<SaveOutlined/>}
                              onClick={() => formRef.submit()}
                              type={'primary'}>
                        {intl.formatMessage({id: 'auth.register', defaultMessage: 'Register'})}
                      </Button>
                    ]}/>
        <Form name={'auth_finish_signup'}
              layout={'vertical'}
              className={stylesAuth.loginForm}
              size={'large'}
              fields={entityForm}
              form={formRef}
              onFinish={onFinish}>
          <GenericPanel header={intl.formatMessage({id: 'business.usersDetails', defaultMessage: 'Business user details'})}
                        name={'usersDetails'}
                        defaultActiveKey={['usersDetails']}>
            <div>
              <Input type={'text'}
                     label={intl.formatMessage({id: 'business.invitedByUser', defaultMessage: 'Invited by User'})}
                     disabled={true}
                     name={'invitedByUser'}
                     form={formRef}/>
              <Input type={'text'}
                     label={intl.formatMessage({id: 'business:assignedTo', defaultMessage: 'Assigned to Business'})}
                     disabled={true}
                     name={'assignedTo'}
                     form={formRef}/>
            </div>
            <div>
              <Input type={'text'}
                     label={intl.formatMessage({id: 'auth.email', defaultMessage: 'Business Email'})}
                     disabled={true}
                     name={'email'}
                     form={formRef}
                     config={{ ...emailProps(t) }}/>
              <Input type={'text'}
                     label={intl.formatMessage({id: 'business:userRoles', defaultMessage: 'Business User Roles'})}
                     disabled={true}
                     name={'userRoles'}
                     form={formRef}/>
            </div>
            <div>
              <Input prefix={<ProfileTwoTone/>}
                     name={'firstName'}
                     label={intl.formatMessage({id: 'form.firstName', defaultMessage: 'First Name'})}
                     allowClear={true}
                     form={formRef}
                     config={{ rules: [{ required: true }] }}/>
              <Input prefix={<ProfileTwoTone/>}
                     name={'lastName'}
                     label={intl.formatMessage({id: 'form.lastName', defaultMessage: 'Last Name'})}
                     allowClear={true}
                     form={formRef}
                     config={{ rules: [{ required: true }] }}/>
            </div>
            <div>
              <Input.Password prefix={<LockTwoTone/>}
                              name={'password'}
                              label={intl.formatMessage({id: 'auth.password', defaultMessage: 'Password'})}
                              form={formRef}
                              autoComplete={'new-password'}
                              extra={intl.formatMessage({id: 'auth.passwordHelper', defaultMessage: 'Use {length} or more characters with a mix of letters, numbers & symbols'}, { length: MIN_PASSWORD_LENGTH })}
                              onChange={e => onUpdateMeter({ e, setMeterValue, setMeterText })}
                              config={{
                                rules: [
                                  { required: true },
                                  ({ getFieldValue }) => ({
                                    validator(_, value) {
                                      if (value && getFieldValue('password').length < MIN_PASSWORD_LENGTH) {
                                        return Promise.reject(
                                            intl.formatMessage({id: 'auth.passwordTooEasy', defaultMessage: 'Use' +
                                                  ' {length} characters or more for your password'}, { length: MIN_PASSWORD_LENGTH }));
                                      }
                                      return Promise.resolve();
                                    }
                                  })
                                ]
                              }}/>
              <Input.Password prefix={<LockTwoTone/>}
                              name={'password_confirm'}
                              label={intl.formatMessage({id: 'auth.passwordConfirm', defaultMessage: 'Password Confirmation'})}
                              form={formRef}
                              autoComplete={'new-password'}
                              extra={intl.formatMessage({id: 'auth.passwordHelper', defaultMessage: 'Use {length} or more characters with a mix of letters, numbers & symbols'}, { length: MIN_PASSWORD_LENGTH })}
                              onChange={e => onUpdateMeter({ e, setMeterValue, setMeterText })}
                              config={{
                                rules: [
                                  { required: true },
                                  ({ getFieldValue }) => ({
                                    validator(_, value) {
                                      if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                      }

                                      return Promise.reject(intl.formatMessage({id: 'auth.passwordConfirmNotValid', defaultMessage: "The two passwords that you entered do not match"}));
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
      </Page>
  );
};
