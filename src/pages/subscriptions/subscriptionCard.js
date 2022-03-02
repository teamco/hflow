import React from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useintl } from 'umi';
import { COLORS } from '@/utils/colors';
import { currencyFormat } from '@/utils/currency';
import { stub } from '@/utils/function';
import { sortBy } from '@/utils/array';

import styles from 'pages/subscriptions/subscriptions.module.less';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
const SubscriptionCard = (props) => {
  const intl = useintl();
  const {
    actions,
    data = {},
    isEdit = false,
    style,
    className,
    colorsToType,
    features,
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

    return intl.formatMessage({id: 'subscription.discountInfo', defaultMessage: 'Discount {discount}'}, { discount: _discount });
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
        <p>{intl.formatMessage({id: 'subscription.usersInfo', defaultMessage: 'Upto to {users} users'}, { users })}</p>
        <ul>
          {sortBy(features.all, 'translateKeys.title', t).map((_pref, idx) => {
            const isActive = features.selected.includes(_pref.id);

            const { title, helper, description, on, off } = _pref.translateKeys;
            const icon = isTrue(isActive);
            const simple = on.match(/yes/);

            return (
                <li key={idx}>
                  {simple ? icon : isTrue(true)}
                  <h3 className={simple ? (isActive ? styles.active : null) : styles.active}>
                    {simple ? (
                        <span>{intl.formatMessage({id: title, defaultMessage: ''})}</span>
                    ) : (
                        <div className={isActive ? styles.complex : null}>
                          {intl.formatMessage({id: isActive ? on : off, defaultMessage: ''})}
                          <span>{intl.formatMessage({id: title, defaultMessage: ''})}</span>
                        </div>
                    )}
                  </h3>
                </li>
            );
          })}
        </ul>
        <h1>{currencyFormat({ price: _price })}</h1>
        <h4>{data?.paymentDuration?.type}</h4>
        <h2>{discountInfo(discount)}</h2>
        <Button onClick={onSelectSubscription}>{intl.formatMessage({id: 'subscription.select', defaultMessage: 'Select'})}</Button>
      </div>
  );
};

export default SubscriptionCard;
