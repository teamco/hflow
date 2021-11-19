import React from 'react';
import { withTranslation } from 'react-i18next';
import classnames from 'classnames';

import styles from 'pages/landing/landing.module.less';

const Applications = props => {
  const { t, className, trends = [] } = props;

  return (
      <div className={classnames(className, styles.applications)}>
        <h1>{t('landing:applications')}</h1>
      </div>
  );
};

export default withTranslation()(Applications);
