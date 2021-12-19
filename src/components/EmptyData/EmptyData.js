import { Empty } from 'antd';
import classnames from 'classnames';
import React from 'react';

import styles from './emptyData.less';

/**
 * @default
 * @export
 * @param [props]
 * @return {JSX.Element}
 * @constructor
 */
const EmptyData = (props = {}) => {
  const {
    image = Empty.PRESENTED_IMAGE_SIMPLE,
    className
  } = props;

  return (
      <div className={classnames(styles.emptyData, className)}>
        <Empty image={image} />
      </div>
  );
};

export default EmptyData;
