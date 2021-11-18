import React from 'react';
import { Layout } from 'antd';
import classnames from 'classnames';

import styles from 'components/Footer/footer.module.less';

const { Footer } = Layout;

export const footer = props => {
  const { children, className, ...rest } = props;

  return (
      <Footer className={classnames(styles.footer, className)}
              {...rest}>
        {children}
      </Footer>
  );
};
