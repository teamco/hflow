import React from 'react';
import { Layout } from 'antd';

import styles from 'components/Footer/footer.module.less';

const { Footer } = Layout;

export const footer = props => {
  const { t, style, children } = props;

  return (
      <Footer className={styles.footer}
              style={style}>
        {children}
      </Footer>
  );
};
