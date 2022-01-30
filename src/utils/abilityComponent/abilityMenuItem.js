import { Menu } from 'antd';
import React from 'react';
import { stub } from '@/utils/function';

/**
 * @export
 * @param props
 * @return {JSX.Element|null}
 * @constructor
 */
export const abilityMenuItem = props => {
  const {
    canI,
    icon,
    children,
    key,
    loading,
    onClick = stub
  } = props;

  return (
      <Menu.Item icon={icon}
                 disabled={!canI}
                 loading={loading}
                 key={key}
                 onClick={onClick}>
        {children}
      </Menu.Item>
  );
};

