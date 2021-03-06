import React from 'react';
import classnames from 'classnames';

import Border from '@/components/Border';

import styles from 'pages/landing/landing.module.less';

const Search = props => {
  const { className } = props;

  const bottomProps = {
    direction: 'bottom',
    dims: {
      left: { width: '45vw' },
      right: { width: '15vw' },
      top: { width: '15vh', color: '#fff', style: 'solid' }
    }
  };

  return (
      <div className={styles.searchWrapper}>
        <div className={classnames(className, styles.search)}>
        </div>
      </div>
  );
};

export default Search;
