import React from 'react';
import { HolderOutlined } from '@ant-design/icons';

import styles from '@/components/Main/Sider/sider.module.less';

/**
 * @constant
 * @returns {false|JSX.Element}
 * @constructor
 */
export const Holder = () => {
  return (
      <div className={styles.resizeable}>
        <HolderOutlined/>
        <HolderOutlined/>
      </div>
  );
};