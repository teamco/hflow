import React from 'react';
import classnames from 'classnames';

import { bottomPolygon } from '@/components/Border/border.config';

import styles from '@/pages/landing/landing.module.less';

const Search = props => {
  const { className } = props;

  return (
      <div className={styles.searchWrapper}
           style={{clipPath: bottomPolygon()}}>
        <div className={classnames(className, styles.search)}>
        </div>
      </div>
  );
};

export default Search;
