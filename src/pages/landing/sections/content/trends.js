import React from 'react';
import { withTranslation } from 'react-i18next';
import classnames from 'classnames';

import styles from 'pages/landing/landing.module.less';

const Trends = props => {
  const { t, className, trends = [] } = props;

  return (
      <div className={classnames(className, styles.trends)}>
        <h1>{t('landing:trends')}</h1>
      </div>
  );
};

export default withTranslation()(Trends);
