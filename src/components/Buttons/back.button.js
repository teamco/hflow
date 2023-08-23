import React from 'react';
import { Button } from 'antd';
import { AlertOutlined } from '@ant-design/icons';
import { history, useIntl } from '@umijs/max';
import queryString from 'query-string';

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
const backButton = props => {
  const intl = useIntl();

  const {
    testId,
    loading,
    className,
    disabled,
    path,
    icon = <AlertOutlined/>,
    onClick = stub,
    size = 'small',
    type = 'default',
    spinOn = []
  } = props;

  const _spinOn = [...spinOn];

  const { referrer } = queryString.parse(window.location.search);

  return referrer ? (
      <Button key={'back'}
              size={size}
              data-testid={testId}
              className={className}
              disabled={disabled}
              icon={icon}
              type={type}
              loading={isSpinning(loading, _spinOn)}
              onClick={() => {
                onClick();
                history.replace(path || decodeURIComponent(referrer.toString()));
              }}>
        {t(intl, 'actions.back')}
      </Button>
  ) : null;
};

export default backButton;
