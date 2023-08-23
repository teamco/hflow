import React from 'react';
import { useIntl } from '@umijs/max';

import ErrorPage from '@/components/Page/Error';

import { t } from '@/utils/i18n';

/**
 * @function
 * @param component
 * @return {JSX.Element}
 */
function pageWarning({ component = 'pageWarning' }) {
  const intl = useIntl();

  return (
      <ErrorPage title={t(intl, 'error.pageWarning')}
                 plainOn={component === 'pageWarning'}
                 isLanding={true}
                 component={component}
                 status={'warning'}/>
  );
}

export default pageWarning;
