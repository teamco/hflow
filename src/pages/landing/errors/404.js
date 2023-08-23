import React from 'react';
import { useIntl } from '@umijs/max';

import { t } from '@/utils/i18n';

import ErrorPage from '@/components/Page/Error';

/**
 * @function
 * @param component
 * @return {JSX.Element}
 */
function page404({ component = 'page404' }) {
  const intl = useIntl();

  return (
      <ErrorPage title={t(intl, 'error.page404')}
                 plainOn={component === 'page404'}
                 isLanding={true}
                 component={component}
                 status={404}/>
  );
}

export default page404;
