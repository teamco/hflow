import React from 'react';
import { history } from 'umi';

import styles from '@/components/Logo/logo.module.less';

const logo = props => {
  const { imgSrc, title, description, url } = props;
  return (
      <div className={styles.logo}
           onClick={() => history.replace(url)}>
        <img src={imgSrc} alt={title}/>
        <h3>{title}</h3>
        <h6>{description}</h6>
      </div>
  );
};

export default logo;
