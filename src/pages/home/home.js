import React, {useEffect} from 'react';

import Page from 'components/Page';

import styles from 'pages/home/home.module.less';

export const home = (props) => {
  const {t, pageModel, loading} = props;

  useEffect(() => {
  }, []);

  const component = 'home';

  return (
      <Page className={styles.home}
            component={component}>
        Home
      </Page>
  );
};
