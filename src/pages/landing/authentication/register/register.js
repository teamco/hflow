import React, { useState } from 'react';
import { Form, Layout } from 'antd';
import { useIntl, history } from '@umijs/max';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import LandingPage from '@/layouts/landing/page';

import { t } from '@/utils/i18n';
import { logger } from '@/utils/console';
import { componentAbilities } from '@/utils/auth/component.setting';
import { isSpinning } from '@/utils/state';

import ErrorModal from '@/components/Authentication/modals/error.modal';
import AuthButton from '@/components/Buttons/auth.button';

import RegisterForm
  from '@/pages/landing/authentication/register/sections/register.form';

import { firebaseAppAuth } from '@/services/firebase.service';

import styles from '@/pages/landing/landing.module.less';
import registerStyles
  from '@/pages/landing/authentication/register/register.module.less';
import { effectHook } from '@/utils/hooks';

const { Content } = Layout;
const { GoogleBtn, FacebookBtn, TwitterBtn } = AuthButton;

/**
 * @constant
 * @param props
 * @returns {JSX.Element}
 */
const LandingRegister = props => {
  const intl = useIntl();
  const [formRef] = Form.useForm();

  /* These props are provided by withFirebaseAuth HOC */
  const {
    onSignInWithGoogle,
    signInWithFacebook,
    signInWithTwitter,
    onRegisterData,
    user,
    loading
  } = props;

  const {
    authModel,
    landingModel,
    firebaseModel
  } = props;

  const { credential, error } = firebaseModel;

  const [errorMsg, setErrorMsg] = useState(null);

  const component = 'landing.register';
  const { ability } = componentAbilities(authModel, component, false);

  const {
    header: { position, title }
  } = landingModel;

  const contentProps = {
    className: position === 'fixed' ? styles.contentFixed : null
  };

  const handleErrorCancel = () => {
    setErrorMsg(null);
  };

  /**
   * @constant
   * @param values
   */
  const onFinish = values => {
    createUserWithEmailAndPassword(
        firebaseAppAuth,
        values.email,
        values.password
    ).then(cred => {

      onRegisterData({
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        isBusinessUser: false
      }, cred?.user);

    }).catch(handleError);
  };

  const handleError = error => {
    const errorCode = error?.code;
    const errorMessage = error?.message;

    setErrorMsg({
      title: t(intl, 'error.errorNum', { number: errorCode }),
      error: errorMessage
    });

    logger({ type: 'error', log: { error, credential } });
  };

  effectHook(() => {
    if (error?.code === 'SMTP') {
      history.push('/login');
    } else {
      error && handleError(error);
    }
  }, [error]);

  const disabledAuthBtns = isSpinning(loading, [
        'authModel/signIn',
        'authModel/defineAbilities',
        'authModel/registerData',
        'firebaseModel/signInWithPassword',
        'firebaseModel/signInWithGoogle',
        'firebaseModel/refreshSignIn'
      ],
      !!user ||
      error?.code === 'SMTP' ||
      ability.cannot('register', 'landing.register'));

  return (
      <LandingPage spinEffects={['landingModel/query']}>
        <Layout style={{ minHeight: '100vh' }} {...contentProps}>
          <Content className={registerStyles.registerWrapper}>
            <ErrorModal errorProps={errorMsg}
                        className={registerStyles.error}
                        isErrorVisible={!!errorMsg}
                        handleErrorCancel={handleErrorCancel}/>
            <RegisterForm models={{ authModel, landingModel }}
                          onFinish={onFinish}
                          formRef={formRef}
                          loading={loading}
                          disabled={disabledAuthBtns}
                          wrapClassName={registerStyles.register}
                          buttons={[
                            <GoogleBtn key={0}
                                       disabled={disabledAuthBtns}
                                       onClick={() => onSignInWithGoogle()}/>,
                            <FacebookBtn key={1}
                                         disabled={true}
                                         onClick={() => signInWithFacebook()}/>,
                            <TwitterBtn key={2}
                                        disabled={true}
                                        onClick={() => signInWithTwitter()}/>
                          ]}/>
          </Content>
        </Layout>
      </LandingPage>
  );
};

export default LandingRegister;
