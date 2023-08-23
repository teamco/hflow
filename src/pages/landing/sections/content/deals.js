import React from 'react';
import { useIntl } from '@umijs/max';
import classnames from 'classnames';

import Border from '@/components/Border';
import { bottomProps, topProps } from '@/components/Border/border.config';

import { t } from '@/utils/i18n';

import styles from '@/pages/landing/landing.module.less';

const Deals = props => {
  const intl = useIntl();
  const { className } = props;

  return (
      <div className={styles.dealsWrapper}>
        <Border {...topProps()}/>
        <div className={classnames(className, styles.deals)}>
          <h1>{t(intl, 'landing.deals')}</h1>

        </div>
        <Border {...bottomProps()}/>
      </div>
  );
};

export default Deals;
