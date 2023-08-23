import React, { Suspense, useState } from 'react';
import { Outlet, useIntl, Helmet } from '@umijs/max';
import ReactInterval from 'react-interval';
import { Form, Layout } from 'antd';
import queryString from 'query-string';

import Page404 from '@/pages/404';
import Page403 from '@/pages/403';
import LandingPage from '@/layouts/landing/page/landing.page.connect';
import LandingLogin from '@/pages/landing/authentication/login/login.connect';

import Loader from '@/components/Loader';
import Main from '@/components/Main';

import { effectHook } from '@/utils/hooks';
import { t } from '@/utils/i18n';
import { Can } from '@/utils/auth/can';

import './app.layout.module.less';

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

  const {
    appModel,
    authModel,
    notificationModel,
    loading,
    onToggleMenu,
    onUpdate404,
    onUpdateDocumentMeta,
    onRoute,
    onCloseSiderPanel
  } = props;

  const {
    is404,
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
    waitBeforeLogin,
    siderPanels
  } = appModel;

  const { user, ability } = authModel;

  const outlet = is404 ? <Page404/> : <Outlet/>;

  const [authLoader, setAuthLoader] = useState(true);

  effectHook(() => {
    setAuthLoader(ability.cannot('read', 'admin'));
  }, [user, ability]);

  const siderProps = {
    onClose: onCloseSiderPanel,
    ...siderPanels[siderPanels?.currentPanel]
  };

  const handleUserAuth = () => {
    // TODO (teamco): Find better solution.
    const isAuthenticated = user || mode === 'signIn';

    setAuthLoader(!isAuthenticated);
  };

  const menuProps = {
    loading,
    authModel,
    notificationModel,
    isSider: true,
    defaultDims: {
      min: 80,
      max: 250
    }
  };

  const component = 'admin';
  const ableFor = 'manage';

  return (
      <LandingPage spinEffects={[
        'appModel/query',
        'authModel/signIn',
        'firebaseModel/refreshSignIn'
      ]}>
        <Can I={ableFor} a={component}>
          <div className={'admin'}>
            <Helmet>
              <meta charSet={meta.charSet}/>
              <title>{`${meta.name} ${meta.title}`}</title>
            </Helmet>
            <ReactInterval timeout={waitBeforeLogin}
                           enabled={true}
                           callback={handleUserAuth}/>
            {authLoader ? (
                <div className={'adminLoading'}>
                  <LandingLogin currentUser={user}/>
                </div>
            ) : (
                <Suspense fallback={(
                    <Loader loading={loading} spinOn={['appModel/query']}/>
                )}>
                  {/* Have to refresh for production environment */}
                  <Layout style={{ minHeight: '100vh' }} key={language}>
                    {mainMenu && (
                        <Main.Menu data={menus}
                                   spinOn={[
                                     'appModel/query',
                                     'authModel/signIn',
                                     'firebaseModel/refreshSignIn'
                                   ]}
                                   {...menuProps}
                                   onRoute={onRoute}
                                   model={appModel}
                                   collapsed={collapsedMenu}
                                   onCollapse={onToggleMenu}/>
                    )}
                    <Layout className={'site-layout'}>
                      <Layout>
                        <Content>
                          <Form.Provider>
                            {pageBreadcrumbs && mode !== 'signIn' && (
                                <Main.Breadcrumbs meta={meta}
                                                  onUpdate404={onUpdate404}
                                                  onUpdateDocumentMeta={onUpdateDocumentMeta}/>
                            )}
                            <div className={'site-layout-content'}>
                              {outlet}
                            </div>
                          </Form.Provider>
                        </Content>
                        <Main.Sider {...siderProps}/>
                      </Layout>
                      {mainFooter && (
                          <Main.Footer author={t(intl, 'common.author', { year: 2021 })}/>
                      )}
                    </Layout>
                  </Layout>
                </Suspense>
            )}
          </div>
        </Can>
        <Page403 component={component} ableFor={ableFor}/>
      </LandingPage>
  );
};
