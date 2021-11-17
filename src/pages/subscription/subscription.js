import React, { useEffect, useState } from 'react';
import { Col, Row, Space } from 'antd';
import Subscription from 'components/Subscription';
import SignUp from 'components/Authentication/signUp.connect';
import LandingPage from 'layouts/landing/page';

import styles from 'pages/subscription/subscription.module.less';

export const subscription = (props) => {
  const {
    authModel,
    subscriptionModel,
    onQuery,
    onSignIn,
    loading
  } = props;

  useEffect(() => {
    onQuery({ type: 'application' });
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

  const prepareLandingSubscriptions = () => {
    const { subscriptions: { data } } = subscriptionModel;
    return data?.map((item) => {
      const dataProps = prepareSubscriptionProps(item);
      return (
          <Col span={8}>
            <Subscription {...dataProps} />
          </Col>
      );
    });
  };

  const prepareSubscriptionProps = (props) => {
    return {
      className: styles.assign,
      actions: [
        <div className={styles.button}
             onClick={handleAssignSubscription}>
          {props.buttonTitle}
        </div>
      ],
      cover: (
          <div className={styles.content}>
            <h2>{props.title}</h2>
            <h3>{props.price}<sup>$</sup></h3>
            <span>{props.priceTerm}</span>
          </div>
      ),
      meta: {
        description: <h5>Core course library, paths and skill assessments</h5>
      }
    };

  };

  return (
      <LandingPage spinEffects={[
        'subscriptionModel/query',
        'subscriptionModel/assignTo'
      ]}>
        <Row justify={'center'}>
          <Space direction={'horizontal'}>
            {prepareLandingSubscriptions()}
          </Space>
        </Row>
        <SignUp {...signUpProps} />
      </LandingPage>
  );
};
