import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';

import LandingHeader from 'components/Landing/landing.header';

import styles from 'pages/landing/landing.module.less';

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 */
const headerSection = props => {

  const {
    t,
    user,
    topUnder,
    onSignOut
  } = props;

  const headerProps = {
    position: 'absolute',
    user,
    topUnder,
    onSignOut
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

export default withTranslation()(headerSection);
