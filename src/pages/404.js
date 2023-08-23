import React from 'react';
import { useIntl } from '@umijs/max';

import { t } from '@/utils/i18n';

import ErrorPage from '@/components/Page/Error';

/**
 * @function
 * @param props
 * @return {JSX.Element}
 */
function page404(props) {
  const intl = useIntl();

  const { component = 'page404' } = props;

  return (
      <ErrorPage title={t(intl, 'error.page404')}
                 component={component}
                 status={404}/>
  );
}

export default page404;
