import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Input } from 'antd';
import { faSearchLocation, faStreetView } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import LandingCarousel from 'components/Landing/landing.carousel';
import LandingHeader from 'components/Landing/landing.header';
import StepsWizard from 'pages/landing/sections/steps.wizard';

import styles from 'pages/landing/landing.module.less';

import icon from 'pages/landing/images/icon.png';
import logoW from 'pages/landing/images/logo_black.png';
import logoB from 'pages/landing/images/logo_orig.png';

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 */
const headerSection = props => {

  const {
    t,
    user,
    swipeProps,
    topUnder,
    onSignOut
  } = props;

  const [wizardVisible, setWizardVisible] = useState(false);

  /**
   * @constant
   * @param e
   */
  const handleWizard = e => {
    e.preventDefault();
    setWizardVisible(true);
  };

  /**
   * @constant
   * @param e
   */
  const handleWizardCancel = e => {
    e.preventDefault();
    setWizardVisible(false);
  };

  const headerProps = {
    position: 'absolute',
    logoW,
    logoB,
    icon,
    user,
    topUnder,
    onSignOut
  };

  const stepProps = {
    wizardVisible,
    handleWizardCancel
  };

  const [geolocation, setGeolocation] = useState(false);

  const handleGeolocation = e => {
    e.preventDefault();
    setGeolocation(true);
  };

  const handleClick = e => {
    e.preventDefault();
  };

  return (
    <>
      <section className={styles.headerSection}>
        <LandingHeader {...headerProps} />
        <LandingCarousel autoplay={false}
                         effect={'scrollx'}
                         swipeProps={swipeProps} />
        <div className={styles.search}>
          <div className={styles.slogan}>
            <span>Your next event starts <u onClick={handleWizard}>here</u></span>
          </div>
          <Input size={'large'}
                 placeholder={t('landing:addressPlaceholder')}
                 prefix={<FontAwesomeIcon icon={faStreetView} />}
                 addonAfter={<FontAwesomeIcon style={{ cursor: 'pointer' }}
                                              onClick={handleGeolocation}
                                              icon={faSearchLocation} />} />
        </div>
      </section>
      <StepsWizard {...stepProps} />
    </>
  );
};

export default withTranslation()(headerSection);