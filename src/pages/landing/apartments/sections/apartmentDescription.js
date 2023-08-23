import React from 'react';
import { useIntl } from '@umijs/max';
import classnames from 'classnames';
import { Affix, Col, Row } from 'antd';
import { CalendarOutlined, ColumnWidthOutlined, InfoCircleOutlined, ZoomInOutlined } from '@ant-design/icons';

import EmptyData from '@/components/EmptyData';
import { RoomIcon } from '@/components/Icons';

import { ApartmentAgentBox } from '@/pages/landing/apartments/sections/apartmentAgentBox';
import { ApartmentMap } from '@/pages/landing/apartments/sections/apartmentMap';
import { ApartmentFeature } from '@/pages/landing/apartments/sections/apartmentFeature';
import { ApartmentInfo } from '@/pages/landing/apartments/sections/apartmentInfo';

import { isSpinning } from '@/utils/state';
import { toNumber } from '@/utils/string';
import { t } from '@/utils/i18n';

import styles from '../apartment.module.less';
import landingStyles from '@/layouts/landing/landing.layout.module.less';

const MODEL_NAME = 'apartmentModel';

export const ApartmentDescription = props => {
  const intl = useIntl();

  const {
    apartment = {},
    address = {},
    loading,
    spinOn = [],
    attributes = {},
    className
  } = props;

  const {
    shortDescription,
    description,
    numberOfRooms,
    condition,
    lotSize,
    buildInYear
  } = apartment;

  const colBig = { xs: 22, sm: 22, md: 22, lg: 12, xl: 12, xxl: 14 };
  const colSmall = { xs: 22, sm: 22, md: 22, lg: 8, xl: 8, xxl: 6 };

  const _attributeKeys = Object.keys(attributes);

  const extraInfo = [
    { icon: (<RoomIcon/>), value: numberOfRooms, name: 'numberOfRooms' },
    { icon: (<InfoCircleOutlined/>), value: condition, name: 'condition' },
    { icon: (<CalendarOutlined/>), value: buildInYear, name: 'buildInYear' }
  ];

  if (lotSize) {
    extraInfo.push({
      icon: (<ColumnWidthOutlined/>),
      value: `${toNumber(lotSize?.value, lotSize)} ${lotSize?.units}`,
      name: 'lotSize'
    });
  }

  return (
      <div className={classnames(styles.descriptionWrapper, className)}>
        <Row className={styles.description}>
          <Col {...colBig} offset={1}>
            <Row className={styles.alignedWrapper}>
              {_attributeKeys?.length ? _attributeKeys.filter(attribute => attributes[attribute]).
                  map((attribute, idx) => (
                      <Col key={idx}>
                        <ApartmentFeature label={attribute}/>
                      </Col>
                  )) : (
                  <EmptyData/>
              )}
            </Row>
            <div className={styles.separator} style={{ position: 'relative' }}>
              <ApartmentMap spinning={isSpinning(loading, [`${MODEL_NAME}/address`])}
                            width={'100%'}
                            height={300}
                            address={address}/>
              <ApartmentMap spinning={isSpinning(loading, [`${MODEL_NAME}/address`])}
                            width={'90vw'}
                            height={'80vh'}
                            inline={false}
                            label={null}
                            mapOpts={{
                              draggable: false,
                              zoomControl: true
                            }}
                            icon={<ZoomInOutlined className={classnames(
                                styles.mapTrigger,
                                landingStyles.prettified,
                                landingStyles.white
                            )}/>}
                            address={address}/>
            </div>
            <div className={styles.separator}>
              <h2>{shortDescription}</h2>
              <p>{description}</p>
            </div>
            <div className={styles.separator}>
              <h3>{t(intl, 'apartment.propertyFeatures')}</h3>
              <ApartmentInfo showPrice={false}
                             explanations={true}
                             className={styles.propertyFeatures}
                             apartment={props.apartment}
                             extra={extraInfo}/>
            </div>
          </Col>
          <Col {...colSmall} offset={1}>
            <Affix offsetTop={70}>
              <ApartmentAgentBox title={'Our Agents'}
                                 loading={loading}
                                 spinOn={spinOn}/>
            </Affix>
          </Col>
        </Row>
        {/*{status && (<h1>{t(intl, `apartment.status.${status}`)}</h1>)}*/}
      </div>
  );
};