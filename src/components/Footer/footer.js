import React from 'react';
import { Layout } from 'antd';
import classnames from 'classnames';

import styles from '@/components/Footer/footer.module.less';

export const Footer = props => {
  const { children, className, ...rest } = props;

  return (
      <Layout.Footer className={classnames(styles.footer, className)}
                     data-testid={'footer'}
                     {...rest}>
        {children}
      </Layout.Footer>
  );
};
