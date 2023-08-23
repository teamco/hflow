import React from 'react';
import { useIntl, Link } from '@umijs/max';

import { t } from '@/utils/i18n';

export const SettingHelper = props => {
  const intl = useIntl();

  const {
    testId,
    type,
    message,
    url,
    className
  } = props;

  return (
      <span className={className}
            data-testid={testId}>
        {t(intl, 'profile.setting.helper', { type })}
        <Link to={url}>{message}</Link>
      </span>
  );
};