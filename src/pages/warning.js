import React from 'react';
import { useIntl } from '@umijs/max';

import ErrorPage from '@/components/Page/Error';

import { t } from '@/utils/i18n';

/**
 *
 * @param component
 * @param errorModel
 * @returns {JSX.Element}
 */
const pageWarning = ({ component = 'pageWarning' }) => {
  const intl = useIntl();

  return (
      <ErrorPage title={t(intl, 'error.pageWarning')}
                 plainOn={component === 'pageWarning'}
                 component={component}
                 status={'warning'}/>
  );
};

export default pageWarning;