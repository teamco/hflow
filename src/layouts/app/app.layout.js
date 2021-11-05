import React, {Suspense, useState} from 'react';
import {Helmet} from 'umi';
import {Form, Layout} from 'antd';
import * as queryString from 'querystring';

import Login from 'pages/login';
import Loader from 'components/Loader';
import Main from 'components/Main';
import {delayedFn} from 'utils/timestamp';

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

  const [isSignInVisible, setIsSignInVisible] = useState(false);

  const {
    t,
    children,
    appModel,
    authModel,
    notificationModel,
    loading,
    onToggleMenu,
    onUpdateDocumentMeta,
    onRoute
  } = props;

  const {
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

  const {user} = authModel;
  const {badge} = notificationModel;

  const headerProps = {t, user, badge};

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
          <Layout style={{minHeight: '100vh'}} key={language ? language : 'en-US'}>
            {mainMenu && (
                <Main.Menu data={menus}
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
      <>
        {isSignInVisible ?
            <Login/> :
            <Loader fullScreen spinning={true}/>
        }
      </>
  );
};
