import React from 'react';
import { useIntl } from 'umi';
import classnames from 'classnames';

import styles from 'pages/landing/landing.module.less';

const Areas = props => {
  const intl = useIntl();
  const { className, trends = [] } = props;

  return (
      <div className={classnames(className, styles.areas)}>
        <h1>{intl.formatMessage({id: 'landing.areas', defaultMessage: 'Most Requested Areas'})}</h1>
      </div>
  );
};

export default Areas;
