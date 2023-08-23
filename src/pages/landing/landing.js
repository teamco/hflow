import React from 'react';

import LandingPage from '@/layouts/landing/page';

import LandingContent from '@/pages/landing/sections/landing.content';

import { effectHook } from '@/utils/hooks';

import styles from '@/pages/landing/landing.module.less';

export const landing = (props) => {
  const {
    authModel,
    landingModel,
    watch = true,
    loading,
    onLike,
    onGetLandingData,
    onFetchCarousel
  } = props;

  const { user, ability } = authModel;

  const {
    header: { position },
    data
  } = landingModel;

  effectHook(() => {
    onGetLandingData();
  }, [ability]);

  const contentProps = {
    data,
    loading,
    className: position === 'fixed' ? styles.contentFixed : null,
    onLike,
    onFetchCarousel
  };

  const component = 'landing';

  return (
      <LandingPage spinEffects={['landingModel/query']}>
        <LandingContent {...contentProps} />
      </LandingPage>
  );
};
