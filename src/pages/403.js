import React from 'react';
import { useIntl } from '@umijs/max';

import { t } from '@/utils/i18n';

import ErrorPage from '@/components/Page/Error';
import { Can } from '@/utils/auth/can';

/**
 * @function
 * @param props
 * @return {JSX.Element}
 */
function page403(props) {
  const intl = useIntl();

  const { component = 'page403', ableFor = 'read' } = props;

  const plainOn = component === 'page403';
  const page = (
      <ErrorPage title={t(intl, 'error.page403')}
                 component={component}
                 status={403}/>
  );

  return plainOn ? page : (
      <Can not I={ableFor} a={component}>{page}</Can>
  );
}

export default page403;
