import React from 'react';
import { Button } from 'antd';
import { useIntl, history } from '@umijs/max';
import { EditOutlined } from '@ant-design/icons';

import { isSpinning } from '@/utils/state';
import { stub } from '@/utils/function';
import { Can } from '@/utils/auth/can';
import { t } from '@/utils/i18n';

/**
 * @export
 * @default
 * @constant
 * @param props
 * @return {JSX.Element}
 */
const editButton = props => {
  const intl = useIntl();

  const {
    className,
    loading,
    disabled,
    url,
    icon = <EditOutlined/>,
    onClick = stub,
    id = null,
    size = 'small',
    type = 'default',
    prefix = '/admin',
    component,
    label = t(intl, 'actions.edit', {type: t(intl, 'form.entity')}),
    spinOn = []
  } = props;

  const entity = props.entity || component;

  const linkTo = url || `${prefix}/${entity}/${id}`;

  const _spinOn = [
    ...spinOn,
    ...[]
  ];

  const handleClick = (e) => {
    onClick(e);
    history.push(linkTo);
  };

  return (
      <Can I={'update'} a={component} key={'update'}>
        <Button size={size}
                className={className}
                loading={isSpinning(loading, _spinOn)}
                disabled={disabled}
                icon={icon}
                onClick={handleClick}
                type={type}>
          {label}
        </Button>
      </Can>
  );
};

export default editButton;
