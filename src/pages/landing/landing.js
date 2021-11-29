import React, { useEffect } from 'react';

import LandingPage from 'layouts/landing/page';
import LandingContent from 'pages/landing/sections/landing.content';

import styles from 'pages/landing/landing.module.less';

export const landing = (props) => {
  const {
    authModel,
    landingModel,
    watch = true,
    loading
  } = props;

  const {
    header: { position },
    data
  } = landingModel;

  useEffect(() => {
  }, []);

  const contentProps = {
    className: position === 'fixed' ? styles.contentFixed : null,
    data
  };

  return (
      <LandingPage spinEffects={['landingModel/query']}>
        <LandingContent {...contentProps} />
      </LandingPage>
  );
};
