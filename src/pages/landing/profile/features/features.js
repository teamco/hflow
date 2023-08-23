import React from 'react';
import { useIntl } from '@umijs/max';

const MODEL_NAME = 'profileModel';

const Features = props => {
  const {
    loading,
  } = props;

  const intl = useIntl();

  return (
      <div className={'site-layout-background'} style={{ padding: 24, minHeight: 360 }}>
        features
      </div>

  );
};

export default Features;
