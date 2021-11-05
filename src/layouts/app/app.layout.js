import React, {Suspense} from 'react';
import {Helmet} from 'umi';
import {Form, Layout} from 'antd';
import * as queryString from 'querystring';

import Login from 'pages/login';
import Loader from 'components/Loader';
import Main from 'components/Main';

import 'utils/i18n';
import './app.layout.less';

const {Content} = Layout;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const AppLayout = (props) => {

  const {mode} = queryString.parse(window.location.search);

  const {
    t,
    children,
    appModel,
    authModel,
    notificationModel,
    loading,
    onToggleMenu,
    onNotification,
    onUpdateDocumentMeta,
    onRoute
  } = props;

  const {
    language,
    menus,
    collapsedMenu,
    activeModel,
    activeButtons,
    activeForm,
    meta,
    interval: {timeout, enabled},
    layoutOpts: {
      mainMenu,
      mainHeader,
      mainFooter,
      pageHeader,
      pageBreadcrumbs
    }
  } = appModel;

  const {user} = authModel;
  const {badge} = notificationModel;

  return user || mode === 'signIn' ? (
      <div className={'admin'}>
        <Helmet>
          <meta charSet={meta.charSet}/>
          <title>{`${meta.name} ${meta.title}`}</title>
        </Helmet>
        <Suspense fallback={<Loader fullScreen spinning={loading.effects['appModel/query']}/>}>
          {/* Have to refresh for production environment */}
          <Layout style={{minHeight: '100vh'}} key={language ? language : 'en-US'}>
            {mainMenu && (
                <Main.Menu data={menus}
                           onRoute={onRoute}
                           model={appModel}
                           collapsed={collapsedMenu}
                           onCollapse={onToggleMenu}/>
            )}
            <Layout className={'site-layout'}>
              {mainHeader && <Main.Header user={user}
                                          badge={badge}/>}
              <Content>
                <Form.Provider>
                  {pageBreadcrumbs && mode !== 'signIn' && (
                      <Main.Breadcrumbs meta={meta}
                                        onUpdateDocumentMeta={onUpdateDocumentMeta}/>
                  )}
                  <div className="site-layout-content">{children}</div>
                </Form.Provider>
              </Content>
              {mainFooter && <Main.Footer author={t('author', {year: 2020})}/>}
            </Layout>
          </Layout>
        </Suspense>
      </div>
  ) : (
      <Login/>
  );
};
