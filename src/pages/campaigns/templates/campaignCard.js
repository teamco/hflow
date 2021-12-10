import React from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import { COLORS } from 'utils/colors';
import { currencyFormat } from 'utils/currency';
import { stub } from 'utils/function';

import styles from 'pages/campaigns/campaigns.module.less';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
const CampaignCard = (props) => {
  const {
    t,
    actions,
    data = {},
    isEdit = false,
    style,
    className,
    colorsToType,
    onSelectCampaign = stub
  } = props;

  const {
    campaignType,
    price,
    discount,
    discountType,
    campaignPeriod,
    users,
    features
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

    return t('campaign:discountInfo', { discount: _discount });
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
    const isActive = features[key];
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
              { color: colorsToType[campaignType?.toLowerCase()] } :
              null
        }>
          {campaignType}
        </h1>
        <p>{t('campaign:usersInfo', { users })}</p>
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
        {/*<h4>{campaignPeriod[data?.campaignPeriod]}</h4>*/}
        <h2>{discountInfo(discount)}</h2>
        <Button onClick={onSelectCampaign}>{t('campaign:select')}</Button>
      </div>
  );
};

export default CampaignCard;
