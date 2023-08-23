import React from 'react';
import { Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

import { isSpinning } from '@/utils/state';
import { stub } from '@/utils/function';

/**
 * @export
 * @default
 * @constant
 * @param {{spinOn}} props
 * @return {JSX.Element}
 */
const reloadButton = props => {
  const {
    loading,
    className,
    disabled,
    icon = <ReloadOutlined/>,
    onClick = stub,
    size = 'small',
    type = 'primary',
    label,
    spinOn = []
  } = props;

  const _spinOn = [...spinOn];

  return (
      <Button type={type}
              size={size}
              icon={icon}
              className={className}
              disabled={disabled}
              onClick={onClick}
              loading={isSpinning(loading, _spinOn)}>
        {label}
      </Button>
  );
};

export default reloadButton;
