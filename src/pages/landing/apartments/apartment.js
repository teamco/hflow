import React from 'react';
import { useIntl, useParams } from '@umijs/max';
import { Col, Row, Layout } from 'antd';
import classnames from 'classnames';

import LandingPage from '@/layouts/landing/page';

import { effectHook } from '@/utils/hooks';

import { ApartmentShare } from '@/pages/landing/apartments/sections/apartmentShare';
import { ApartmentThumbs } from '@/pages/landing/apartments/sections/apartmentThumbs';
import { ApartmentInfo } from '@/pages/landing/apartments/sections/apartmentInfo';
import { ApartmentDescription } from '@/pages/landing/apartments/sections/apartmentDescription';
import { ApartmentMore } from '@/pages/landing/apartments/sections/apartmentMore';
import { ApartmentLike } from '@/pages/landing/apartments/sections/apartmentLike';

import landingStyles from '@/pages/landing/landing.module.less';
import styles from './apartment.module.less';

const MODEL_NAME = 'apartmentModel';

const { Header, Content, Footer } = Layout;

export const Apartment = props => {
  const intl = useIntl();

  const {
    loading,
    landingModel,
    apartmentModel,
    authModel,
    onQuery,
    onAddress,
    onHide,
    onLike
  } = props;

  /**
   * @constant
   * @type {{apartment}}
   */
  const params = useParams();

  const component = 'apartments';

  const {
    header: { position }
  } = landingModel;

  const {
    thumbsCount,
    selectedApartment: {
      addressByRef,
      miniCardPhotos = [],
      status,
      attributes = {}
    },
    selectedAddress,
    viewed,
    liked
  } = apartmentModel;

  const { addressLine1, city, state, zipCode } = selectedAddress || {};

  effectHook(() => {
    onQuery(params.apartment);
  });

  effectHook(() => {
    addressByRef && onAddress(addressByRef);
  }, [addressByRef]);

  const contentProps = {
    className: classnames(position === 'fixed' ?
            landingStyles.contentFixed : null,
        styles.apartmentWrapper
    )
  };

  // TODO (teamco): Must be changed.
  const { encodedBase64 } = miniCardPhotos[0] || {};

  const thumbs = encodedBase64 ? [
    { src: `data:image/png;base64,${encodedBase64}`, description: 'Description 1' },
    { src: `data:image/png;base64,${encodedBase64}`, description: 'Description 2' },
    { src: `data:image/png;base64,${encodedBase64}`, description: 'Description 3' },
    { src: `data:image/png;base64,${encodedBase64}`, description: 'Description 4' },
    { src: `data:image/png;base64,${encodedBase64}`, description: 'Description 5' },
    { src: `data:image/png;base64,${encodedBase64}`, description: 'Description 6' }
  ] : [];

  return (
      <LandingPage spinEffects={[
        `${MODEL_NAME}/query`
      ]}>
        <Layout {...contentProps}>
          <Layout>
            <Header className={classnames(landingStyles.header, landingStyles.headerSection)}
                    style={{ justifyContent: 'end' }}>
              <div className={landingStyles.headerActions}>
                <ApartmentLike apartment={apartmentModel?.selectedApartment}
                               className={landingStyles.likeBtn}
                               liked={liked}
                               spinOn={[`${MODEL_NAME}/like`]}
                               loading={loading}
                               onClick={onLike}/>
                <ApartmentShare address={selectedAddress}
                                className={landingStyles.shareBtn}/>
                <ApartmentMore loading={loading}
                               className={landingStyles.moreBtn}/>
              </div>
            </Header>
            <Content className={styles.apartment}>
              <div className={styles.metadataWrapper}>
                <Row className={styles.metadata}>
                  <Col span={6}
                       offset={1}
                       className={styles.addressWrapper}>
                    <div className={styles.address}>
                      <div>{addressLine1}</div>
                      <div>{city}, {state} {zipCode}</div>
                    </div>
                    <ApartmentInfo apartment={apartmentModel?.selectedApartment}/>
                  </Col>
                  <Col span={15} offset={1}>
                    <ApartmentThumbs apartment={apartmentModel?.selectedApartment}
                                     spinning={!encodedBase64}
                                     size={10}
                                     viewed={viewed}
                                     status={status}
                                     gallery={{
                                       main: `data:image/png;base64,${encodedBase64}`,
                                       thumbs: {
                                         count: encodedBase64 ? thumbsCount : 0,
                                         images: [...thumbs]
                                       }
                                     }}/>
                  </Col>
                </Row>
              </div>
              <ApartmentDescription apartment={apartmentModel?.selectedApartment}
                                    address={selectedAddress}
                                    attributes={attributes}
                                    spinOn={[`${MODEL_NAME}/agents`]}
                                    loading={loading}/>
            </Content>
            <Footer>TODO: Welcome Home</Footer>
          </Layout>
        </Layout>
      </LandingPage>
  );
};