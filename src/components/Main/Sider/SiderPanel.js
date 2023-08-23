import React, { useState } from 'react';
import { Spin } from 'antd';
import { Resizable } from 're-resizable';
import classnames from 'classnames';

import { effectHook } from '@/utils/hooks';
import { isSpinning } from '@/utils/state';

import { Holder } from '@/components/Main/Sider/Holder';
import { SiderComponent } from '@/components/Main/Sider/SiderComponent';

import styles from './sider.module.less';

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const SiderPanel = props => {
  const {
    loading,
    model,
    spinEffects = [],
    visible = false,
    resizeable = false,
    place = 'right',
    maxWidth = 1024,
    minWidth = 80,
    position = 'absolute',
    onResizeStop = (_e, _direction, _ref, _updated) => {
      // console.log('stop', e, direction, ref, updated);
      // TODO (teamco): Do something.
    }
  } = props;

  const [dim, setDim] = useState(minWidth);

  const rightCSS = place === 'right' ? styles.right : null;
  const leftCSS = place === 'left' ? styles.left : null;
  const topCSS = place === 'top' ? styles.top : null;
  const bottomCSS = place === 'bottom' ? styles.bottom : null;

  const horizontal = ['left', 'right'];
  const vertical = ['top', 'bottom'];

  const isHorizontal = horizontal.includes(place);
  const isVertical = vertical.includes(place);

  const onUpdateDim = updated => setDim(dim + (isHorizontal ? updated.width : updated.height));

  effectHook(() => {
    setDim(minWidth);
  }, [minWidth]);

  /**
   * @constant
   * @type {Size|{width: string|number}|{height: string|number}}
   */
  const size = horizontal ? { width: dim } : { height: dim };

  /**
   * @constant
   * @type {Size|{width: string|number}|{height: string|number}}
   */
  const defaultSize = horizontal ? { width: dim } : { height: dim };

  const _component = resizeable ? (
      <Resizable className={classnames(
          rightCSS,
          leftCSS,
          topCSS,
          bottomCSS,
          styles[position],
          styles.siderPanel
      )}
                 size={size}
                 defaultSize={defaultSize}
                 minWidth={minWidth}
                 maxWidth={maxWidth}
                 enable={{
                   top: isVertical,
                   right: isHorizontal,
                   bottom: isVertical,
                   left: isHorizontal,
                   topRight: false,
                   bottomRight: false,
                   bottomLeft: false,
                   topLeft: false
                 }}
                 handleComponent={{ left: <Holder/> }}
                 onResizeStop={(e, direction, ref, updated) => {
                   onResizeStop(e, direction, ref, updated);
                   onUpdateDim(updated);
                 }}>
        <SiderComponent {...props} size={size}/>
      </Resizable>
  ) : (
      <SiderComponent {...props} size={size}/>
  );

  const _loadingComponent = loading ? (
      <Spin spinning={isSpinning(loading, spinEffects)}
            wrapperClassName={styles.spinner}>{_component}</Spin>
  ) : _component;

  return visible ? (
      <div className={styles.siderWrapper}>
        {_loadingComponent}
      </div>
  ) : null;
};

export default SiderPanel;
