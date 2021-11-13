import React, { useEffect, useState } from 'react';

import Subscription from 'components/Subscription';
import SignUp from 'components/Authentication/signUp.connect';
import LandingPage from 'layouts/landing/page';

import styles from 'pages/subscription/subscription.module.less';

export const subscription = (props) => {
  const {
    t,
    authModel,
    subscriptionModel,
    onQuery,
    onSignIn,
    loading
  } = props;

  useEffect(() => {
    onQuery();
  }, []);

  const handleAssignSubscription = e => {
    e.preventDefault();
    setIsRegisterVisible(true);
  };

  const [isRegisterVisible, setIsRegisterVisible] = useState(false);

  const signUpProps = {
    MIN_PASSWORD_LENGTH: authModel.MIN_PASSWORD_LENGTH,
    isRegisterVisible,
    setIsRegisterVisible,
    onSignIn,
    isSignInAble: false
  };

  const subscriptionProps = {
    className: styles.assign,
    actions: [
      <div className={styles.button}
           onClick={handleAssignSubscription}>
        Start with standard
      </div>
    ],
    cover: (
        <div className={styles.content}>
          <h2>Standard</h2>
          <h3>299<sup>$</sup></h3>
          <span>per year</span>
        </div>
    ),
    meta: {
      description: <h5>Core course library, paths and skill assessments</h5>
    }
  };

  return (
      <LandingPage spinEffects={[
        'subscriptionModel/query',
        'subscriptionModel/assignTo'
      ]}>
        <div className={styles.subscription}>
          <Subscription {...subscriptionProps}/>
          <SignUp {...signUpProps} />
        </div>
      </LandingPage>
  );
};
