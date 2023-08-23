import React from 'react';
import { getLocale, useIntl } from '@umijs/max';
import classnames from 'classnames';
import { Col, Row } from 'antd';

import { toNumber, toPrice } from '@/utils/string';
import { t } from '@/utils/i18n';

import {
  BathIcon,
  BedIcon,
  FloorIcon,
  ParkingIcon,
  RulerIcon,
  WaterHeaterTypeIcon,
  WindowIcon
} from '@/components/Icons';

import styles from '../apartment.module.less';

export const ApartmentInfo = props => {
  const language = getLocale();
  const intl = useIntl();

  const {
    apartment = {},
    className,
    showPrice = true,
    explanations = false,
    extra = []
  } = props;

  const {
    livingArea,
    numberOfBathrooms,
    numberOfBedrooms,
    numberOfFloorsInBuilding,
    numberOfParkingPlaces,
    floor,
    waterHeaterType,
    windowsFeatures,
    price
  } = apartment;

  const explained = (value, name) => {
    if (explanations) {
      return (
          <>
            <h4>{t(intl, `apartment.${name}`)}</h4>
            {value}
          </>
      );
    }

    return value;
  };

  return (
      <div className={classnames(styles.info, className, explanations ? null : styles.small)}>
        {price && showPrice ? (
            <p>
              {toPrice(price?.originalPrice, language, { currency: price?.currency })}
            </p>
        ) : null}
        <Row className={styles.alignedWrapper}>
          <Col>
            <div className={styles.infoItem}>
              <BedIcon/>
              {explained(numberOfBedrooms, 'numberOfBedrooms')}
            </div>
          </Col>
          <Col>
            <div className={styles.infoItem}>
              <BathIcon/>
              {explained(numberOfBathrooms, 'numberOfBathrooms')}
            </div>
          </Col>
          {livingArea ? (
              <Col>
                <div className={styles.infoItem}>
                  <RulerIcon/>
                  {explained(`${toNumber(livingArea?.value, language)} ${livingArea?.units}`, 'livingArea')}
                </div>
              </Col>
          ) : null}
          <Col>
            <div className={styles.infoItem}>
              <FloorIcon floor={floor} type={explanations ? null : 'small'}/>
              {explained(numberOfFloorsInBuilding, 'numberOfFloorsInBuilding')}
            </div>
          </Col>
          <Col>
            <div className={styles.infoItem}>
              <ParkingIcon/>
              {explained(numberOfParkingPlaces, 'numberOfParkingPlaces')}
            </div>
          </Col>
          <Col>
            <div className={styles.infoItem}>
              <WaterHeaterTypeIcon/>
              {explained(waterHeaterType, 'waterHeaterType')}
            </div>
          </Col>
          <Col>
            <div className={styles.infoItem}>
              <WindowIcon/>
              {explained(windowsFeatures, 'windowsFeatures')}
            </div>
          </Col>
        </Row>
        <Row className={styles.alignedWrapper}>
          {extra.map((info, idx) => (
              <Col key={idx}>
                <div className={styles.infoItem}>
                  {info?.icon}
                  {explained(info?.value, info?.name)}
                </div>
              </Col>
          ))}
        </Row>
      </div>
  );
};