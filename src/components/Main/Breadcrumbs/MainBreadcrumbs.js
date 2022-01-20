import React from 'react';
import { Breadcrumb } from 'antd';
import { withTranslation } from 'react-i18next';
import { NavLink } from 'umi';
import { withBreadcrumbs } from 'utils/breadcrumbs';

import { routes } from '/routes';
import { effectHook } from '@/utils/hooks';

/**
 * This component is wrapped in withBreadcrumbs which automatically
 * generates breadcrumbs based on the current route.
 * If you need custom or dynamic breadcrumbs.
 * Check out the Readme here:
 * @link https://github.com/icd2k3/react-router-breadcrumbs-hoc#dynamic-breadcrumbs
 * @constant
 * @param breadcrumbs
 * @param meta
 * @param onUpdateDocumentMeta
 * @param onUpdate404
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const Breadcrumbs = ({ breadcrumbs, meta, onUpdateDocumentMeta, onUpdate404, ...props }) => {
  const { t, is404 } = props;
  const title = breadcrumbs?.map(({ breadcrumb }) => t(breadcrumb))?.join(' / ');

  effectHook(() => {
    onUpdateDocumentMeta({ title });
  }, [title && (title !== meta.title)]);

  effectHook(() => {
    onUpdate404(is404);
  }, [is404]);

  return (
      <Breadcrumb className={'site-breadcrumbs'}>
        {breadcrumbs?.map((data = {}) => {
          const { match, breadcrumb } = data;
          return (
              <Breadcrumb.Item key={match.url}>
                <NavLink to={match.url}>{t(breadcrumb)}</NavLink>
              </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
  );
};

export default withBreadcrumbs(routes)(withTranslation()(Breadcrumbs));
