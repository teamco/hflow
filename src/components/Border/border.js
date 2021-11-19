import React from 'react';
import classnames from 'classnames';

import styles from './border.module.less';

const Border = props => {
  const { className, direction, dims } = props;

  const types = {
    top: 'Bottom',
    bottom: 'Top',
    left: 'Right',
    right: 'Left'
  };

  const vertical = direction === 'top' || direction === 'bottom';

  let style = vertical ? {
    borderLeftWidth: dims.left.width,
    borderRightWidth: dims.right.width
  } : {
    borderTopWidth: dims.top.width,
    borderBottomWidth: dims.bottom.width
  };

  const route = types[direction];
  const routeKey = dims[route.toLowerCase()];

  style = {
    ...style,
    ...{
      [`border${route}Width`]: routeKey.width,
      [`border${route}Color`]: routeKey.color,
      [`border${route}Style`]: routeKey.style
    }
  };

  return (
      <div className={classnames(styles.border, styles[direction], className)}
           style={style}/>
  );
};

export default Border;
