import React from 'react';
import { withTranslation } from 'react-i18next';
import classnames from 'classnames';

import styles from 'pages/landing/landing.module.less';

const RealEstate = props => {
  const { t, className, realEstate = [] } = props;

  return (
      <div className={classnames(className, styles.realEstate)}>

      </div>
  );
};

export default withTranslation()(RealEstate);
