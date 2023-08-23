import React from 'react';

import Page from '@/components/Page/page.connect';

import styles from '@/pages/home/home.module.less';
import { effectHook } from '@/utils/hooks';

export const home = (props) => {
  const { t, pageModel, loading } = props;

  effectHook(() => {
  }, []);

  const component = 'home';

  return (
      <Page className={styles.home}
            component={component}>
        Home
      </Page>
  );
};
