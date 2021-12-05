import React from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import { COLORS } from 'utils/colors';
import { currencyFormat } from 'utils/currency';
import { stub } from 'utils/function';

import styles from 'pages/subscriptions/subscriptions.module.less';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
const SubscriptionCard = (props) => {
  const {
    t,
    actions,
    data = {},
    isEdit = false,
    style,
    className,
    colorsToType,
    subscriptionPeriod,
    onSelectSubscription = stub
  } = props;

  const {
    subscriptionType,
    price,
    discount,
    discountType,
    users
  } = data;

  const _price = discountType === '%' ?
      price - (price * discount) / 100 :
      price - discount;

  /**
   * @constant
   * @return {*}
   */
  const discountInfo = () => {
    let _discount = `${discount}${discountType}`;
    if (discountType !== '%') {
      _discount = currencyFormat({ price: discount });
    }

    return t('subscription:discountInfo', { discount: _discount });
  };

  /**
   * @constant
   * @param {boolean} value
   * @return {JSX.Element}
   */
  const isTrue = value => {
    return value ?
        <CheckOutlined style={{ color: COLORS.success }} /> :
        <CloseOutlined style={{ color: COLORS.danger }} />;
  };

  /**
   * @constant
   * @param {string} key
   * @param {boolean} [complex]
   * @param {array} [complexKeys]
   * @return {JSX.Element}
   */
  const li = (key, complex = false, complexKeys = ['', '']) => {
    const isActive = data[key];
    const icon = isTrue(isActive);

    return (
        <li>
          {complex ? isTrue(true) : icon}
          <h3 className={complex ? styles.active : isActive ? styles.active : null}>
            {complex ? (
                <div>
                  {t(`subscription:${isActive ? complexKeys[1] : complexKeys[0]}`)}
                  <span>{t(`subscription:${key}`)}</span>
                </div>
            ) : (
                <span>{t(`subscription:${key}`)}</span>
            )}
          </h3>
        </li>
    );
  };

  return (
      <div style={style}
           className={className}>
        {isEdit && (
            <div className={styles.cardMenu}>
              {actions}
            </div>
        )}
        <h1 style={
          colorsToType ?
              { color: colorsToType[subscriptionType?.toLowerCase()] } :
              null
        }>
          {subscriptionType}
        </h1>
        <p>{t('subscription:usersInfo', { users })}</p>
        <ul>
          {li('accessToMessages')}
          {li('dashboard')}
          {li('profile', true, ['basicProfile', 'upgradedProfile'])}
          {li('analytics', true, ['basicAnalytics', 'fullAnalytics'])}
          {li('logoOnPartnersPage')}
          {li('notifications')}
          {li('placementOnMap')}
          {li('requestList')}
        </ul>
        <h1>{currencyFormat({ price: _price })}</h1>
        <h4>{subscriptionPeriod[data?.subscriptionPeriod]}</h4>
        <h2>{discountInfo(discount)}</h2>
        <Button onClick={onSelectSubscription}>{t('subscription:select')}</Button>
      </div>
  );
};

export default SubscriptionCard;
