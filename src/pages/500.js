import React from 'react';
import { useIntl } from '@umijs/max';

import { t } from '@/utils/i18n';

import ErrorPage from '@/components/Page/Error';

/**
 * @function
 * @param props
 * @return {JSX.Element}
 */
function page500(props) {
  const intl = useIntl();

  const { component = 'page500' } = props;

  return (
      <ErrorPage title={t(intl, 'error.page500')}
                 component={component}
                 status={500}/>
  );
}

export default page500;
