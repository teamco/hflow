import React from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useIntl } from '@umijs/max';
import classnames from 'classnames';

import { COLORS } from '@/utils/colors';
import { currencyFormat } from '@/utils/currency';
import { stub } from '@/utils/function';
import { sortBy } from '@/utils/array';
import { t } from '@/utils/i18n';

import styles from '@/pages/subscriptions/subscriptions.module.less';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
const SubscriptionCard = (props) => {
  const intl = useIntl();

  const {
    actions,
    data = {},
    isEdit = false,
    style,
    className,
    colorsToType,
    features,
    canUpdate,
    canDelete,
    disabled = false,
    selected = false,
    onSelectSubscription = stub
  } = props;

  const {
    type,
    paymentDuration,
    price = {},
    numberOfUsers,
    featureType
  } = data;

  const {
    discount,
    discounted,
    discountedPrice,
    originalPrice
  } = price;

  const _price = discounted ? discountedPrice : originalPrice;

  /**
   * @constant
   * @return {*}
   */
  const discountInfo = () => {
    let _discount;

    if (discount.type !== 'Percent') {
      _discount = currencyFormat({ price: discount.type });
    } else {
      _discount = `${discount.value}%`;
    }

    return t(intl, 'subscription.discountInfo', { discount: _discount });
  };

  /**
   * @constant
   * @param {boolean} value
   * @return {JSX.Element}
   */
  const isTrue = value => {
    return value ?
        <CheckOutlined style={{ color: COLORS.success }}/> :
        <CloseOutlined style={{ color: COLORS.danger }}/>;
  };

  const subscriptionFeatures = features?.error ? [] :
      sortBy(
          features?.selected?.filter(feature => feature.type === featureType),
          'translateKeys.title', intl);

  const isBusinessFeature = featureType === 'Business';

  const handleSelect = e => {
    e.preventDefault();
    onSelectSubscription(data);
  };

  return (
      <div style={style}
           className={classnames(className, {
             [styles.editCard]: isEdit
           })}>
        {isEdit && (
            <div className={styles.cardMenu}>
              {actions}
            </div>
        )}
        <div>
          <h1 style={colorsToType ?
              { color: colorsToType[type?.toLowerCase()] } :
              null}>
            {type}
          </h1>
          {isBusinessFeature ? (
              <p>
                {t(intl, 'subscription.usersInfo', { users: numberOfUsers })}
              </p>
          ) : (<p/>)}
        </div>
        <ul>
          {subscriptionFeatures.map((feature, idx) => {
            const { title, description } = feature.translateKeys;
            const icon = isTrue(true);

            return (
                <li key={idx}>
                  {icon}
                  <h3 className={styles.active}>
                    <span>{t(intl, title)}</span>
                  </h3>
                </li>
            );
          })}
        </ul>
        <div>
          <h1>{currencyFormat({ price: _price })}</h1>
          <h4>{paymentDuration?.type}</h4>
          {discounted && (<h2>{discountInfo()}</h2>)}
        </div>
        {isEdit ? null : (
            <Button onClick={handleSelect}
                    disabled={disabled || selected}>
              {selected ?
                  t(intl, 'subscription.selected') :
                  t(intl, 'subscription.select')}
            </Button>
        )}
      </div>
  );
};

export default SubscriptionCard;
