import React from 'react';
import { useIntl } from 'umi';
import classnames from 'classnames';

import styles from 'pages/landing/landing.module.less';

const Trends = props => {
  const intl = useIntl();
  const { className, trends = [] } = props;

  return (
      <div className={classnames(className, styles.trends)}>
        <h1>{intl.formatMessage({id: 'landing.trends', defaultMessage: 'Trends'})}}</h1>
        {trends?.map((trend, idx) => (
            <div key={idx}>
              {trend.name}
            </div>
        ))}
      </div>
  );
};

export default Trends;
