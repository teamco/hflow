import React  from 'react';

import LandingPage from 'layouts/landing/page';
import LandingContent from 'pages/landing/sections/landing.content';

import styles from 'pages/landing/landing.module.less';
import { effectHook } from '@/utils/state';

export const landing = (props) => {
  const {
    authModel,
    landingModel,
    watch = true,
    loading,
    onGetLandingData
  } = props;

  const { user } = authModel;
  
  const {
    header: { position },
    data
  } = landingModel;

  effectHook(() => {
    onGetLandingData();
  }, [user]);

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
