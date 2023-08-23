import React from 'react';
import { useIntl } from '@umijs/max';

import { t } from '@/utils/i18n';

import ErrorPage from '@/components/Page/Error';

/**
 * @function
 * @param component
 * @return {JSX.Element}
 */
function page500({ component = 'page500' }) {
  const intl = useIntl();

  return (
      <ErrorPage title={t(intl, 'error.page500')}
                 plainOn={component === 'page500'}
                 isLanding={true}
                 component={component}
                 status={500}/>
  );
}

export default page500;
