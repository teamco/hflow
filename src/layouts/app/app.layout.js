import React, { Suspense, useState } from 'react';
import { Helmet, useIntl } from 'umi';
import { Form, Layout } from 'antd';
import * as queryString from 'querystring';

import Login from '@/pages/login';
import Page404 from '@/pages/404';

import Loader from '@/components/Loader';
import Main from '@/components/Main';

import { delayedFn } from '@/utils/timestamp';

import '@/utils/i18n';

import './app.layout.less';

const { Content } = Layout;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const AppLayout = (props) => {
  const intl = useIntl();
  const { mode } = queryString.parse(window.location.search);

  const [isSignInVisible, setIsSignInVisible] = useState(false);

  const {
    children,
    appModel,
    authModel,
    notificationModel,
    loading,
    onToggleMenu,
    onUpdate404,
    onUpdateDocumentMeta,
    onRoute,
    onOnline
  } = props;

  const {
    is404,
    isOnline,
    language,
    menus,
    collapsedMenu,
    meta,
    layoutOpts: {
      mainMenu,
      mainHeader,
      mainFooter,
      pageBreadcrumbs
    },
    waitBeforeLogin
  } = appModel;

  delayedFn({
    callback: () => setIsSignInVisible(!isAuth),
    ts: waitBeforeLogin
  });

  const { user, ability } = authModel;
  const { badge } = notificationModel;

  const headerProps = { t, user, badge, isOnline };

  // TODO (teamco): Find better solution.
  const isAuth = user || mode === 'signIn';

  return isAuth ? (
          <div className={'admin'}>
            <Helmet>
              <meta charSet={meta.charSet}/>
              <title>{`${meta.name} ${meta.title}`}</title>
            </Helmet>
            <Suspense fallback={<Loader fullScreen spinning={loading.effects['appModel/query']}/>}>
              {/* Have to refresh for production environment */}
              <Layout style={{ minHeight: '100vh' }} key={language}>
                {mainMenu && (
                    <Main.Menu data={menus}
                               ability={ability}
                               onRoute={onRoute}
                               model={appModel}
                               collapsed={collapsedMenu}
                               onCollapse={onToggleMenu}/>
                )}
                <Layout className={'site-layout'}>
                  {mainHeader && <Main.Header {...headerProps}/>}
                  <Content>
                    <Form.Provider>
                      {pageBreadcrumbs && mode !== 'signIn' && (
                          <Main.Breadcrumbs meta={meta}
                                            onUpdate404={onUpdate404}
                                            onUpdateDocumentMeta={onUpdateDocumentMeta}/>
                      )}
                      <div className={'site-layout-content'}>
                        {is404 ? (<Page404/>) : children}
                      </div>
                    </Form.Provider>
                  </Content>
                  {mainFooter && <Main.Footer author={intl.formatMessage({id: 'author', defaultMessage: 'Author'}, { year: 2020 })}/>}
                </Layout>
              </Layout>
            </Suspense>
          </div>
      ) :
      isSignInVisible ?
          (<Login/>) :
          (<Loader fullScreen spinning={true}/>);
};
