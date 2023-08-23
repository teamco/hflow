import React from 'react';
import { history } from '@umijs/max';
import classnames from 'classnames';

import styles from '@/components/Logo/logo.module.less';

const logo = props => {
  const { imgSrc, title, description, url, className } = props;

  return (
      <div className={classnames(styles.logo, className)}
           onClick={() => url ? history.replace(url) : false}>
        {imgSrc && (<img src={imgSrc} alt={title}/>)}
        {title && (<h3>{title}</h3>)}
        {description && (<h6>{description}</h6>)}
      </div>
  );
};

export default logo;
