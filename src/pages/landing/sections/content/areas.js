import React from 'react';
import { useIntl } from '@umijs/max';
import classnames from 'classnames';

import styles from '@/pages/landing/landing.module.less';
import { t } from '@/utils/i18n';

const Areas = props => {
  const intl = useIntl();
  const { className, trends = [] } = props;

  return (
      <div className={classnames(className, styles.areas)}>
        <h1>{t(intl, 'landing.areas')}</h1>
      </div>
  );
};

export default Areas;
