import React from 'react';
import { withTranslation } from 'react-i18next';
import classnames from 'classnames';

import Border from '@/components/Border';

import styles from 'pages/landing/landing.module.less';

const Deals = props => {
  const { t, className } = props;

  const topProps = {
    direction: 'top',
    dims: {
      left: { width: '15vw' },
      right: { width: '45vw' },
      bottom: { width: '15vh', color: 'rgb(241, 241, 241)', style: 'solid' }
    }
  };

  const bottomProps = {
    direction: 'bottom',
    dims: {
      left: { width: '45vw' },
      right: { width: '15vw' },
      top: { width: '15vh', color: 'rgb(241, 241, 241)', style: 'solid' }
    }
  };

  const colPropsLeft = {
    xs: 24,
    sm: 24,
    md: 24,
    lg: 14,
    xl: 14
  };

  const colPropsRight = {
    xs: 24,
    sm: 24,
    md: 24,
    lg: 10,
    xl: 10
  };

  return (
      <div className={styles.dealsWrapper}>
        <Border {...topProps}/>
        <div className={classnames(className, styles.deals)}>
          <h1>{t('landing:deals')}</h1>

        </div>
        <Border {...bottomProps}/>
      </div>
  );
};

export default withTranslation()(Deals);
