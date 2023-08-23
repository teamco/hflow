import React from 'react';
import { useIntl } from '@umijs/max';

import { t } from '@/utils/i18n';

import ErrorPage from '@/components/Page/Error';

/**
 * @function
 * @param component
 * @return {JSX.Element}
 */
function page403({ component = 'page403' }) {
  const intl = useIntl();

  return (
      <ErrorPage title={t(intl, 'error.page403')}
                 isLanding={true}
                 plainOn={component === 'page403'}
                 component={component}
                 status={403}/>
  );
}

export default page403;
