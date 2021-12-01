import React, { useEffect, useState } from 'react';
import {Col, Row } from 'antd';
import { Space, Carousel } from 'antd';
import Subscription from 'components/Subscription';
import SignUp from 'components/Authentication/signUp.connect';
import LandingPage from 'layouts/landing/page';

import styles from 'pages/subscriptions/subscriptions.module.less';

export const subscriptions = (props) => {
  const {
    authModel,
    subscriptionsModel,
    onQuery,
    onSignIn,
    loading
  } = props;

  useEffect(() => {
    onQuery({ type: 'application' });
  }, []);

  /**
   * @constant
   */
  const handleAssignSubscription = e => {
    e.preventDefault();
    // check if user registered then update subscription if not open register popup
    const {user} = authModel;
    if (user === null) {
      setIsUserExist(false);
      setIsRegisterVisible(true);
      setIsSignInVisible(false);
    } else {
      // TODO (teamco): Forward to business subscription page and pass subscription id
      setIsUserExist(true);
    }
  };

  const [isRegisterVisible, setIsRegisterVisible] = useState(false);
  const [signInVisible, setIsSignInVisible] = useState(false);
  const [isUserExist, setIsUserExist] = useState(true);

  const signUpProps = {
    MIN_PASSWORD_LENGTH: authModel.MIN_PASSWORD_LENGTH,
    isRegisterVisible,
    setIsRegisterVisible,
    setIsSignInVisible,
    signInVisible,
    onSignIn,
    isSignInAble: false
  };

  /**
   * @constant
   * @return {Array [JSX.Element] }
   */
  const prepareLandingSubscriptions = () => {
    const { subscriptions: { data } } = subscriptionsModel;
    return data?.map((item) => {
      const dataProps = prepareSubscriptionProps(item);
      const {meta: {referenceId}} = item;
      return (
          <Row key={referenceId}>
            <Col span={6} xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
              {/*<Space size={2} direction="horizontal">*/}
                <Subscription {...dataProps} />
              {/*</Space>*/}
            </Col>
          </Row>
      )
    })
  }

  const prepareSubscriptionProps = (props) => {
    const {buttonTitle, title, price, priceTerm, description, meta: {referenceId}} = props;
    return {
      className: styles.assign,
      actions: [
        <div className={styles.button}
             onClick={handleAssignSubscription}>
          {buttonTitle}
        </div>
      ],
      cover: (
          <div className={styles.content}>
            <h2>{title}</h2>
            <h3>{price}<sup>$</sup></h3>
            <span>{priceTerm}</span>
          </div>
      ),
      meta: {
        description: <h5>{description}</h5>
      },
      id: {referenceId}
    }
  };

  return (
      <LandingPage spinEffects={[
        'subscriptionsModel/query',
        'subscriptionsModel/assignTo'
      ]}>
            <Carousel
                slidesToShow={3}
                adaptiveHeight={true}>
                  {prepareLandingSubscriptions()}
            </Carousel>
          {
            !isUserExist && <SignUp {...signUpProps} />
          }
      </LandingPage>
  );
};