import React, { useState } from 'react';
import { Form, Layout } from 'antd';
import { useIntl, history } from '@umijs/max';
import queryString from 'query-string';

import { effectHook } from '@/utils/hooks';
import { logger } from '@/utils/console';
import { t } from '@/utils/i18n';
import { componentAbilities } from '@/utils/auth/component.setting';
import { isSpinning } from '@/utils/state';

import { isLoginPage } from '@/services/common.service';

import LoginForm from '@/pages/landing/authentication/login/login.form';
import ErrorModal from '@/components/Authentication/modals/error.modal';
import AuthButton from '@/components/Buttons/auth.button';
import LandingPage from '@/layouts/landing/page';

import styles from '@/pages/landing/landing.module.less';
import loginStyles
  from '@/pages/landing/authentication/login/login.module.less';

const { Content } = Layout;
const { GoogleBtn, FacebookBtn, TwitterBtn } = AuthButton;

/**
 * @constant
 * @param props
 * @returns {JSX.Element}
 */
const LandingLogin = props => {
  const intl = useIntl();
  const [formRef] = Form.useForm();

  const {
    onSignInWithPassword,
    onSignInWithGoogle,
    signInWithFacebook,
    signInWithTwitter,
    authModel,
    appModel,
    firebaseModel,
    landingModel,
    loading
  } = props;

  const component = 'landing.login';
  const { ability } = componentAbilities(authModel, component, false);

  const { user } = authModel;
  const { error, credential } = firebaseModel;
  const { location: { pathname, search } } = appModel;

  const [errorMsg, setErrorMsg] = useState(null);

  const { ref } = queryString.parse(search);

  const isLogin = isLoginPage(pathname);

  effectHook(() => {
    if (user && isLogin) {
      history.push(ref ? ref : '/profile');
    }
  }, [user]);

  effectHook(() => {
    setErrorMsg(!!error);
  }, [error]);

  const {
    header: { position }
  } = landingModel;

  const contentProps = {
    className: position === 'fixed' ? styles.contentFixed : null
  };

  let errorProps = {};

  if (errorMsg) {
    errorProps = {
      title: t(intl, 'error.errorNum', { number: error?.code }),
      error: error?.message
    };

    logger({ type: 'error', log: { error, credential } });
  }

  /**
   * @constant
   */
  const handleErrorCancel = () => {
    setErrorMsg(false);
  };

  /**
   * @constant
   * @param values
   */
  const onFinish = values => {
    formRef.validateFields().then(() => onSignInWithPassword(values));
  };

  const disabledAuthBtns = isSpinning(loading, [
        'authModel/signIn',
        'authModel/defineAbilities',
        'firebaseModel/signInWithPassword',
        'firebaseModel/signInWithGoogle',
        'firebaseModel/refreshSignIn'
      ],
      !!user ||
      error?.code === 'SMTP' ||
      ability?.cannot('login', 'landing.login'));

  return (
      <LandingPage spinEffects={['landingModel/query']}>
        <Layout style={{ minHeight: '100vh' }} {...contentProps}>
          <Content className={loginStyles.loginWrapper}>
            <ErrorModal errorProps={errorProps}
                        className={loginStyles.error}
                        isErrorVisible={!!errorMsg}
                        handleErrorCancel={handleErrorCancel}/>
            <LoginForm models={{ authModel, landingModel }}
                       onFinish={onFinish}
                       formRef={formRef}
                       user={user}
                       error={error}
                       loading={loading}
                       disabled={disabledAuthBtns}
                       wrapClassName={loginStyles.login}
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

export default LandingLogin;
