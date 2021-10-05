import React, {useEffect, useState} from 'react';

import {FacebookOutlined, GoogleOutlined, TwitterOutlined} from '@ant-design/icons';
import {Button, Tooltip} from 'antd';

import ErrorModal from 'components/Authentication/modals/error.modal';
import SignInModal from 'components/Authentication/modals/signin.modal';
import SignUp from 'components/Authentication/signUp';
import Page from 'components/Page';
import Logo from 'components/Logo';

import {isLoading} from 'utils/state';

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 */
export const login = (props) => {

  /* These props are provided by withFirebaseAuth HOC */
  const {
    signInWithEmailAndPassword,
    signInWithGoogle,
    signInWithFacebook,
    signInWithTwitter,
    setError,
    user,
    error,
    loading
  } = props;

  const {
    t,
    authModel,
    signInVisible
  } = props;

  const [isSignInVisible, setIsSignInVisible] = useState(true);
  const [isRegisterVisible, setIsRegisterVisible] = useState(false);
  const [isErrorVisible, setIsErrorVisible] = useState(false);

  useEffect(() => {
    if (user && !authModel.user && !Object.keys(authModel.registerData).length) {
      props.onSignIn(user);
    }
  }, [user]);

  let errorProps = {};

  if (error) {
    errorProps = {
      title: t('error:errorNum', {number: 400}),
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
    signInWithEmailAndPassword(values.email, values.password);
  };

  /**
   * @constant
   * @param provider
   * @param icon
   * @param signInFn
   * @return {JSX.Element}
   */
  const authBtn = (provider, icon, signInFn) => (
      <Tooltip title={t('auth:signInWith', {provider})}>
        <Button loading={isLoading(loading)}
                onClick={() => handleCancel(signInFn)}
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
      signInWithGoogle
  );

  /**
   * @constant
   * @type {JSX.Element}
   * @private
   */
  const _facebookBtn = authBtn(
      'Facebook',
      <FacebookOutlined/>,
      signInWithFacebook
  );

  /**
   * @constant
   * @type {JSX.Element}
   * @private
   */
  const _twitterBtn = authBtn(
      'Twitter',
      <TwitterOutlined/>,
      signInWithTwitter
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
    t,
    isSignInVisible,
    signInVisible: true,
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
  };

  const logoProps = {
    url: '/',
    title: '__TITLE_'
  };

  return (
      <Page component={'login'}>
        <Logo {...logoProps} />
        <SignUp {...signUpProps} />
        <ErrorModal errorProps={errorProps}
                    isErrorVisible={isErrorVisible}
                    handleErrorCancel={handleErrorCancel} />
        <SignInModal {...signInProps} />
      </Page>
  );
};