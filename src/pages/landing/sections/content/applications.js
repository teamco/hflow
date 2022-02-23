import React from 'react';
import { useIntl } from 'umi';
import classnames from 'classnames';

import styles from 'pages/landing/landing.module.less';

const Applications = props => {
  const intl = useIntl();
  const { className, trends = [] } = props;

  return (
      <div className={classnames(className, styles.applications)}>
        <h1>{intl.formatMessage({id: 'landing.applications', defaultMessage: 'Useful Applications'})}</h1>
      </div>
  );
};

export default Applications;
