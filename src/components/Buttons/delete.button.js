import React from 'react';
import { Button, Popconfirm } from 'antd';
import { useIntl } from '@umijs/max';
import { DeleteOutlined } from '@ant-design/icons';

import { isSpinning } from '@/utils/state';
import { stub } from '@/utils/function';
import { Can } from '@/utils/auth/can';
import { t } from '@/utils/i18n';

/**
 * @export
 * @default
 * @constant
 * @param {{spinOn}} props
 * @return {JSX.Element}
 */
const deleteButton = props => {
  const intl = useIntl();

  const {
    className,
    loading,
    disabled,
    icon = <DeleteOutlined/>,
    onClick = stub,
    size = 'small',
    type = 'default',
    component,
    entity = t(intl, 'form.entity'),
    label = t(intl, 'actions.delete'),
    spinOn = []
  } = props;

  const _spinOn = [
    ...spinOn,
    ...[]
  ];

  return (
      <Can I={'delete'} a={component} key={'delete'}>
        <Popconfirm title={t(intl, 'msg.deleteConfirm', { instance: entity })}
                    placement={'top'}
                    disabled={disabled}
                    onConfirm={onClick}>
          <Button size={size}
                  danger
                  className={className}
                  loading={isSpinning(loading, _spinOn)}
                  disabled={disabled}
                  icon={icon}
                  type={type}>
            {label}
          </Button>
        </Popconfirm>
      </Can>
  );
};

export default deleteButton;
