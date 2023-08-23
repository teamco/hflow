import React from 'react';
import { Resizable } from 'react-resizable';

import { stub } from '@/utils/function';

import styles from '../table.module.less';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const ResizableTitle = (props) => {
  const {
    width,
    onResize = stub,
    ...restProps
  } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
      <Resizable width={width}
                 height={0}
                 handle={
                   <span className={styles.resizableHandler}
                         onClick={(e) => {
                           e.stopPropagation();
                         }}/>
                 }
                 onResize={onResize}
                 draggableOpts={{
                   enableUserSelectHack: false
                 }}>
        <th {...restProps} />
      </Resizable>
  );
};

/**
 * @export
 * @param props
 * @return {(function(*, {size: *}): void)|*}
 */
export const handleResize = (props = {}) => {
  const {
    index,
    columns = [],
    setColumns = stub
  } = props;

  return (_, { size }) => {
    const newColumns = [...columns];
    newColumns[index] = {
      ...newColumns[index],
      width: size.width
    };

    setColumns(newColumns);
  };
};