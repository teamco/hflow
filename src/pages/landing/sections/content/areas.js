import React from 'react';
import { withTranslation } from 'react-i18next';
import classnames from 'classnames';

import styles from 'pages/landing/landing.module.less';

const Areas = props => {
  const { t, className, trends = [] } = props;

  return (
      <div className={classnames(className, styles.areas)}>
        <h1>{t('landing:areas')}</h1>
      </div>
  );
};

export default withTranslation()(Areas);
