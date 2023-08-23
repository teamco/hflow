import React from 'react';
import {Outlet} from '@umijs/max';

import { stub } from '@/utils/function';

/**
 * @export
 * @param props
 * @return {[{children, icon, disabled: boolean, label: JSX.Element, key}]}
 */
export const abilityMenuItem = props => {
  const {
    canI,
    icon,
    key,
    divider = false,
    onClick = stub
  } = props;

  const dividerItem = divider ? [{ type: 'divider' }] : [];

  return [
    {
      label: (
          <span onClick={onClick}>
            {props.children}
          </span>
      ),
      disabled: !canI,
      key,
      icon
    },
    ...dividerItem
  ];
};

