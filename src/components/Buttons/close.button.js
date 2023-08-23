import React from 'react';
import { Button } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';

import { isSpinning } from '@/utils/state';
import { stub } from '@/utils/function';
import { t } from '@/utils/i18n';

/**
 * @export
 * @default
 * @constant
 * @param {{spinOn}} props
 * @return {JSX.Element}
 */
const closeButton = props => {
  const intl = useIntl();

  const {
    loading,
    className,
    disabled,
    icon = <CloseCircleOutlined/>,
    onClick = stub,
    size = 'small',
    type = 'default',
    modelName,
    spinOn = []
  } = props;

  const _spinOn = [
    ...spinOn,
    ...modelName ? [
      `${modelName}/handleUpdate`,
      `${modelName}/handleSave`,
      `${modelName}/prepareToSave`
    ] : []];

  return (
      <Button key={'close'}
              size={size}
              className={className}
              disabled={disabled}
              icon={icon}
              type={type}
              loading={isSpinning(loading, _spinOn)}
              onClick={onClick}>
        {t(intl, 'actions.close')}
      </Button>
  );
};

export default closeButton;
