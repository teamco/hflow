import React from 'react';
import { Card, Col, Spin } from 'antd';
import { HeartTwoTone } from '@ant-design/icons';
import { getLocale } from '@umijs/max';
import classnames from 'classnames';

import { toNumber, toPrice } from '@/utils/string';
import { stub } from '@/utils/function';

import { BathIcon, BedIcon, RulerIcon } from '@/components/Icons';

import styles from '@/components/ApartmentCard/apartmentCard.module.less';
import landingStyles from '@/layouts/landing/landing.layout.module.less';

const { Meta } = Card;

export const ApartmentCard = props => {
  const language = getLocale();

  const {
    id,
    loading,
    span = { span: 8 },
    hoverable = true,
    images = [],
    status,
    className,
    livingArea,
    numberOfBathrooms,
    numberOfBedrooms,
    price: { originalPrice, currency },
    address: { addressLine1, city, state, zipCode },
    likes,
    onClick = stub,
    onLike = stub
  } = props;

  const { likedByUser } = likes || {};
  const { url } = images[0];

  /**
   * @constant
   * @param e
   * @param {function} [callback]
   */
  const handleClick = (e, callback = stub) => {
    e.preventDefault();
    e.stopPropagation();

    callback(props);
  };

  const colProps = {
    ...span,
    className: styles.trendCardWrapper
  }

  return (
      <Col {...colProps}>
        <Card hoverable={hoverable}
              className={classnames(className, styles.trendCard)}
              onClick={e => handleClick(e, onClick)}
              cover={(
                  <div>
                    <span>{status}</span>
                    <span>
                        <HeartTwoTone onClick={e => handleClick(e, onLike)}
                                      className={
                                        classnames(
                                            landingStyles.prettified,
                                            likedByUser ? landingStyles.liked : null
                                        )}/>
                    </span>
                    <img src={url} alt={status}/>
                  </div>
              )}>
          <Meta title={(
              <div className={styles.title}>
                <p>{toPrice(originalPrice, language, { currency })}</p>
                <div>
                  <span><BedIcon/>{numberOfBedrooms}</span>
                  <span><BathIcon/>{numberOfBathrooms}</span>
                  <span><RulerIcon/>{toNumber(livingArea.value, language)} {livingArea.units}</span>
                </div>
              </div>
          )}
                description={(
                    <div className={styles.description}>
                      <div><span>{addressLine1}, {city}</span></div>
                      <div>{state} {zipCode}</div>
                    </div>
                )}/>
        </Card>
      </Col>
  );
};