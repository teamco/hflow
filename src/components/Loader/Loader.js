import React from 'react';
import { Spin } from 'antd';
import classnames from 'classnames';

import { isSpinning } from '@/utils/state';

import ModelLoader from '@/components/Main/ModelLoader';

import styles from './loader.less';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const Loader = (props) => {
  const {
    spinning = false,
    loading,
    spinOn = [],
    children,
    className,
    wrapperClassName
  } = props;

  const _nestedChildren = children?.props?.children;
  const _spinning = spinning || isSpinning(loading, spinOn);
  const _className = classnames(styles.loader, className, {
    [styles.fullScreen]: !_nestedChildren?.length && _spinning
  });

  return (
      <div className={_className}>
        <Spin wrapperClassName={wrapperClassName}
              spinning={_spinning}
              tip={_nestedChildren?.length ? (
                  <ModelLoader loading={loading}
                               spinEffects={spinOn}/>
              ) : null}>
          {children}
        </Spin>
      </div>
  );
};

export default Loader;
