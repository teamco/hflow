import React, {memo, Suspense} from 'react';
import {connect} from 'dva';
import {history, withRouter, Helmet} from 'umi';
import {Form, Layout} from 'antd';
import {withTranslation} from 'react-i18next';

import Login from 'pages/login';
import Loader from 'components/Loader';
import Main from 'components/Main';

import 'utils/i18n';
import './app.layout.less';

const {Content} = Layout;
const queryString = require('query-string');


const AppLayout = (props) => {

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
}

export default withRouter(
    connect(
        ({appModel, authModel, notificationModel, loading}) => ({
          appModel,
          authModel,
          notificationModel,
          loading
        }),
        (dispatch) => ({
          dispatch,
          onRoute(path) {
            history.push(path);
          },
          onToggleMenu(collapse) {
            dispatch({
              type: `appModel/toggleMenu`,
              payload: {collapse}
            });
          },
          onActiveTab(payload) {
            dispatch({
              type: 'appModel/checkActiveTab',
              payload
            });
          },
          onNotification() {
            dispatch({type: 'appModel/notification'});
          },
          onDefineAbilities() {
            dispatch({type: 'authModel/defineAbilities'});
          },
          onUpdateDocumentMeta(meta) {
            dispatch({type: 'appModel/updateDocumentMeta', payload: {meta}});
          }
        })
    )(withTranslation()(memo(AppLayout)))
);
