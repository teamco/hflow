import React, { useState } from 'react';
import { useIntl } from '@umijs/max';
import { FacebookOutlined, GoogleOutlined, TwitterOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { signInWithEmailAndPassword } from 'firebase/auth';

import ErrorModal from '@/components/Authentication/modals/error.modal';
import SignInModal from '@/components/Authentication/modals/signin.modal';
import Page from '@/components/Page/page.connect';
import Logo from '@/components/Logo';

import { effectHook } from '@/utils/hooks';
import { t } from '@/utils/i18n';

import { firebaseAppAuth, providers } from '@/services/firebase.service';

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 */
export const Login = (props) => {
  const intl = useIntl();

  /* These props are provided by withFirebaseAuth HOC */
  const {
    setError,
    user,
    error
  } = props;

  const {
    authModel,
    isVisible = true,
    mask = true,
    maskStyle,
    wrapClassName
  } = props;

  const component = 'login';

  const [isSignInVisible, setIsSignInVisible] = useState(isVisible);
  const [isRegisterVisible, setIsRegisterVisible] = useState(false);
  const [isErrorVisible, setIsErrorVisible] = useState(false);

  effectHook(() => {
    if (user && !authModel.user && !Object.keys(authModel.registerData).length) {
      props.onSignIn(user);
    }
  }, [user]);

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
   * @param signInFn
   */
  const handleCancel = signInFn => {
    if (typeof signInFn === 'function') {
      signInFn();
    }
  };

  /**
   * @constant
   * @param values
   */
  const onFinish = values => {
    signInWithEmailAndPassword(firebaseAppAuth, values.email, values.password).then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // ...
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  };

  /**
   * @constant
   * @param provider
   * @param icon
   * @param signInFn
   * @return {JSX.Element}
   */
  const authBtn = (provider, icon, signInFn) => (
      <Tooltip title={t(intl, 'auth.signInWith', { provider: provider })}>
        <Button onClick={() => handleCancel(signInFn)}
                icon={icon}
                size={'small'}>
          {provider}
        </Button>
      </Tooltip>
  );

  /**
   * @constant
   * @type {JSX.Element}
   * @private
   */
  const _googleBtn = authBtn(
      'Google',
      <GoogleOutlined/>,
      providers.googleProvider
  );

  /**
   * @constant
   * @type {JSX.Element}
   * @private
   */
  const _facebookBtn = authBtn(
      'Facebook',
      <FacebookOutlined/>,
      providers.facebookProvider
  );

  /**
   * @constant
   * @type {JSX.Element}
   * @private
   */
  const _twitterBtn = authBtn(
      'Twitter',
      <TwitterOutlined/>,
      providers.twitterProvider
  );

  const signUpProps = {
    MIN_PASSWORD_LENGTH: authModel.MIN_PASSWORD_LENGTH,
    isRegisterVisible,
    setIsRegisterVisible,
    setIsSignInVisible,
    signInVisible: true,
    onSignIn: props.onSignIn
  };

  const signInProps = {
    isSignInVisible,
    signInVisible: true,
    handleCancel,
    authModel,
    onFinish,
    setIsSignInVisible,
    setIsRegisterVisible,
    mask,
    maskStyle,
    wrapClassName,
    buttons: [
      _googleBtn,
      _facebookBtn,
      _twitterBtn
    ]
  };

  const logoProps = {
    url: '/',
    title: '__TITLE__'
  };

  return (
      <Page component={'login'}>
        <Logo {...logoProps} />
        {/*<SignUp {...signUpProps} />*/}
        <ErrorModal errorProps={errorProps}
                    isErrorVisible={isErrorVisible}
                    handleErrorCancel={handleErrorCancel}/>
        <SignInModal {...signInProps} />
      </Page>
  );
};
