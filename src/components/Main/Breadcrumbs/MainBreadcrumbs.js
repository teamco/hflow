import React from 'react';
import { Breadcrumb } from 'antd';
import { NavLink, withRouter, useSelectedRoutes, useIntl } from '@umijs/max';
import classnames from 'classnames';

import useReactRouterBreadcrumbs from '@/utils/breadcrumbs';
import { effectHook } from '@/utils/hooks';
import { t } from '@/utils/i18n';

import { isNew } from '@/services/common.service';

import styles from './MainBreadcrumbs.module.less';

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
const Breadcrumbs = ({ meta, onUpdateDocumentMeta, onUpdate404, ...props }) => {
  const intl = useIntl();

  const selectedRoutes = useSelectedRoutes();
  const breadcrumbs = useReactRouterBreadcrumbs(selectedRoutes) || [];

  const { is404 } = props;

  const filtered = breadcrumbs.filter(
      data => data?.breadcrumb?.props?.children !== 'route.page404');

  const title = filtered?.map(
      ({ breadcrumb }) => t(intl, breadcrumb?.props?.children))?.join(' / ');

  effectHook(() => {
    if (title === meta.title) {
      // TODO (teamco): Do something.
    } else {
      onUpdateDocumentMeta({ title });
    }
  }, [title]);

  effectHook(() => {
    onUpdate404(is404);
  }, [is404]);

  const items = filtered.map((data, idx) => {
    const { match, breadcrumb } = data || {};
    const title = t(intl, breadcrumb?.props?.children);
    return {
      title: (
          <NavLink to={match.pathname}>
            {idx === breadcrumbs.length - 1 ?
                isNew(match.pathname, true) ? (
                        <>
                          {t(intl, 'actions.new')}
                          <span> </span>
                          {t(intl, breadcrumb?.props?.children)}
                        </>
                    ) :
                    match.pathname.match(/[\da-fA-F]{24}$/) ?
                        t(intl, 'actions.edit', { type: title }) : title :
                title
            }
          </NavLink>
      )
    };
  });

  return (
      <Breadcrumb className={classnames(styles.breadcrumbs)}
                  items={items}/>
  );
};

export default withRouter(Breadcrumbs);
