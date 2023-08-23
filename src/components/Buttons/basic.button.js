import React from 'react';
import { Button } from 'antd';
import { useIntl, history } from '@umijs/max';
import { AppstoreAddOutlined } from '@ant-design/icons';

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
const basicButton = props => {
  const intl = useIntl();

  const {
    className,
    loading,
    disabled,
    icon = <AppstoreAddOutlined/>,
    onClick = stub,
    size = 'small',
    type = 'primary',
    modelName,
    url,
    prefix = '/admin',
    component,
    title = t(intl, 'actions.new'),
    spinOn = []
  } = props;

  const entity = props.entity || component;

  const linkTo = url === null ? null : url ?? `${prefix}/${entity}/new`;

  const _spinOn = [
    ...spinOn,
    ...[]
  ];

  const handleClick = (e) => {
    e.preventDefault();

    onClick(e);
    linkTo && history.push(linkTo);
  };

  return (
      <Can I={'create'} a={component} key={'add'}>
        <Button size={size}
                className={className}
                loading={isSpinning(loading, _spinOn)}
                disabled={disabled}
                icon={icon}
                onClick={handleClick}
                type={type}>
          {title}
        </Button>
      </Can>
  );
};

export default basicButton;
