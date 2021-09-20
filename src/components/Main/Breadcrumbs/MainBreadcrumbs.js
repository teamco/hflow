import React, {useEffect} from 'react';
import {Breadcrumb} from 'antd';
import {withTranslation} from 'react-i18next';
import {NavLink} from 'umi';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';

import {routes} from '/routes';

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
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const Breadcrumbs = ({breadcrumbs, meta, onUpdateDocumentMeta, ...props}) => {
  const {t} = props;

  const title = breadcrumbs.map(({breadcrumb}) => t(breadcrumb.props.children)).join(' / ');

  useEffect(() => {
    onUpdateDocumentMeta({title});
  }, [title !== meta.title]);

  return (
      <Breadcrumb className={'site-breadcrumbs'}>
        {breadcrumbs.map(({match, breadcrumb}) => {
          return breadcrumb.props.children && (
              <Breadcrumb.Item key={match.url}>
                <NavLink to={match.url}>{t(breadcrumb.props.children)}</NavLink>
              </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
  );
};

export default withBreadcrumbs(routes)(withTranslation()(Breadcrumbs));
