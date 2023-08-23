import React from 'react';
import { Button, Dropdown } from 'antd';
import {
  DownOutlined,
  EllipsisOutlined,
  SettingOutlined
} from '@ant-design/icons';

import { isSpinning } from '@/utils/state';
import { stub } from '@/utils/function';

import styles from '@/components/Buttons/button.module.less';
import menuStyles from '@/components/menu.less';

/**
 * @export
 * @default
 * @constant
 * @param {{spinOn}} props
 * @return {JSX.Element}
 */
const dropDownButton = props => {
  const {
    loading,
    className = menuStyles.customAction,
    overlayClassName = menuStyles.customActionMenu,
    disabled,
    icon = <SettingOutlined/>,
    onClick = stub,
    size = 'small',
    type = 'default',
    overlay,
    dataTestId,
    label,
    trigger = ['click'],
    placement = 'bottom',
    spinOn = [],
    children = <EllipsisOutlined key={'more'}/>
  } = props;

  const _spinOn = [...spinOn];

  // const menu = (<Menu items={overlay}/>);

  return (
      <Dropdown menu={{ items: overlay }}
                // overlay={menu}
                overlayClassName={overlayClassName}
                trigger={trigger}
                onClick={onClick}
                data-testid={dataTestId}
                loading={isSpinning(loading, _spinOn)}
                disabled={disabled}
                placement={placement}>
        {label ? (
            <Button size={size}
                    className={className}
                    icon={icon}
                    type={type}>
              {label}
              <DownOutlined className={styles.export}/>
            </Button>
        ) : children}
      </Dropdown>
  );
};

export default dropDownButton;
