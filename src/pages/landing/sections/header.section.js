import React, { useState } from 'react';
import LandingHeader from '@/components/Landing/landing.header';

import styles from 'pages/landing/landing.module.less';

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 */
const headerSection = props => {
  const {
    icon,
    user,
    topUnder,
    position,
    onSignOut
  } = props;

  const headerProps = {
    icon,
    user,
    topUnder,
    onSignOut,
    position
  };

  const [geolocation, setGeolocation] = useState(false);

  const handleGeolocation = e => {
    e.preventDefault();
    setGeolocation(true);
  };

  const handleClick = e => {
    e.preventDefault();
  };

  return (
      <>
        <section className={styles.headerSection}>
          <LandingHeader {...headerProps} />
        </section>
      </>
  );
};

export default headerSection;
