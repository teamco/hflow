import React from 'react';
import { Button } from 'antd';
import { LayoutOutlined } from '@ant-design/icons';

import { isSpinning } from '@/utils/state';
import { stub } from '@/utils/function';

/**
 * @export
 * @default
 * @constant
 * @param {{spinOn}} props
 * @return {JSX.Element}
 */
const layoutButton = props => {

  const {
    loading,
    className,
    disabled,
    icon = <LayoutOutlined/>,
    onClick = stub,
    size = 'small',
    type = 'primary',
    spinOn = []
  } = props;

  const _spinOn = [...spinOn];

  return (
      <Button key={'layout'}
              size={size}
              className={className}
              disabled={disabled}
              icon={icon}
              type={type}
              loading={isSpinning(loading, _spinOn)}
              onClick={onClick}/>
  );
};

export default layoutButton;
