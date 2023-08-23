import React from 'react';
import { useIntl } from '@umijs/max';
import classnames from 'classnames';

import styles from '@/pages/landing/landing.module.less';
import { t } from '@/utils/i18n';

const Applications = props => {
  const intl = useIntl();
  const { className, trends = [] } = props;

  return (
      <div className={classnames(className, styles.applications)}>
        <h1>{t(intl, 'landing.applications')}</h1>
      </div>
  );
};

export default Applications;
