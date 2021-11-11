import React from 'react';
import { Empty } from 'antd';
import styles from './emptyData.less';

const EmptyData = () => {
  return (
      <div className={styles.emptyData}>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
      </div>
  );
};

export default EmptyData;
