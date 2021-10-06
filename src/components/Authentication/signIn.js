import React, {useEffect, useState} from 'react';
import classnames from 'classnames';

import {Button, Tooltip} from 'antd';
import {
  LoginOutlined,
  GoogleOutlined,
  FacebookOutlined,
  TwitterOutlined,
  LogoutOutlined
} from '@ant-design/icons';

import SignUp from 'components/Authentication/signUp.connect';
import ErrorModal from 'components/Authentication/modals/error.modal';
import SignInModal from 'components/Authentication/modals/signin.modal';
import UpdateEmailModal from 'components/Authentication/modals/updateEmail.modal';

import styles from 'components/Authentication/authentication.module.less';
import {isLoading} from 'utils/state';

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 */
export const signIn = props => {

  /* These props are provided by withFirebaseAuth HOC */
  const {
    signInWithEmailAndPassword,
    signInWithGoogle,
    signInWithFacebook,
    // signInWithPhoneNumber,
    // signInWithGithub,
    signInWithTwitter,
    // signInAnonymously,
    signOut,
    setError,
    user,
    error,
    loading
  } = props;

  const {
    t,
    className,
    forceLogin = false,
    closable = false,
    authModel,
    onUpdateEmail,
    onSignIn,
    onSignOutUser,
    setForceSignInVisible,
    signInVisible = false
  } = props;

  const [isSignInVisible, setIsSignInVisible] = useState(signInVisible);
  const [isRegisterVisible, setIsRegisterVisible] = useState(false);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [isNAEmailVisible, setIsNAEmailVisible] = useState(false);

  useEffect(() => {
    if (user) {
      if (authModel.user) {
        const {metadata, email} = authModel.user;
        metadata.forceSignOut && onSignOutUser({user});
        !email && setIsNAEmailVisible(true);
      } else if (forceLogin) {
        onSignIn(user);
      }
    } else {
      // TODO (teamco): Clear garbage.
      // props.onSignOut(user);

      if (forceLogin && signInVisible) {
        setIsSignInVisible(true);
      }
    }

    !signInVisible && setIsSignInVisible(false);

  }, [user, authModel.user, signInVisible]);

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
   */
  const showSignIn = () => {
    setIsSignInVisible(true);
  };

  /**
   * @constant
   * @param signInFn
   */
  const handleCancel = signInFn => {
    if (typeof signInFn === 'function') {
      signInFn();
    } else if (forceLogin && signInVisible) {
      setIsSignInVisible(false);
      setForceSignInVisible(false);
    } else {
      !signInVisible && setIsSignInVisible(false);
    }
  };

  /**
   * @constant
   */
  const handleNAEmailCancel = () => {
    setIsNAEmailVisible(false);
  };

  /**
   * @constant
   * @param {{na_email}} values
   */
  const handleNAEmailOk = values => {
    setIsNAEmailVisible(false);
    onUpdateEmail({user, email: values.na_email});
  };

  /**
   * @constant
   * @private
   */
  const _signOut = () => {
    props.onSignOut(user);
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
                className={styles.authBtn}
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
  // const _phoneBtn = authBtn(
  //   t('auth:phone'),
  //   <PhoneOutlined />,
  //   signInWithPhoneNumber
  // );

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

  /**
   * @constant
   * @type {JSX.Element}
   * @private
   */
  const _signOutBtn = (
      <Button type={'primary'}
              loading={isLoading(loading)}
              onClick={_signOut}
              icon={<LogoutOutlined/>}
              size={'small'}>
        {t('auth:signOut')}
      </Button>
  );

  const signUpProps = {
    MIN_PASSWORD_LENGTH: authModel.MIN_PASSWORD_LENGTH,
    isRegisterVisible,
    setIsRegisterVisible,
    setIsSignInVisible,
    signInVisible,
    onSignIn
  };

  const signInProps = {
    t,
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
  };

  const updateEmailProps = {
    t,
    isNAEmailVisible,
    handleNAEmailCancel,
    handleNAEmailOk,
    loading
  };

  return (
      <div className={classnames(styles.authWrapper, className)}>
        {user && authModel.user ? _signOutBtn : (
            <>
              {!signInVisible && (
                  <Button type={'primary'}
                          size={'small'}
                          icon={<LoginOutlined/>}
                          onClick={showSignIn}>
                    {t('auth:signIn')}
                  </Button>
              )}
            </>
        )}
        <SignUp {...signUpProps} />
        <ErrorModal errorProps={errorProps}
                    isErrorVisible={isErrorVisible}
                    handleErrorCancel={handleErrorCancel}/>
        <SignInModal {...signInProps} />
        <UpdateEmailModal {...updateEmailProps} />
      </div>
  );
};
