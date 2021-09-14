import React, { Suspense, useEffect } from 'react';
import { connect } from 'dva';
import { withRouter, Helmet } from 'umi';
import { Form, Layout } from 'antd';
import ReactInterval from 'react-interval';

import Loader from 'components/Loader';

import { AbilityContext } from 'utils/auth/can';

import 'utils/i18n';
import styles from './landing.layout.module.less';

const { Content } = Layout;

const LandingLayout = (props) => {

  const {
    t,
    children,
    appModel,
    authModel,
    loading,
    onNotification
  } = props;

  const {
    language = 'en-US',
    meta,
    interval: { timeout, enabled },
    layoutOpts: {}
  } = appModel;

  const { user, ability } = authModel;

  useEffect(() => {
    props.onDefineAbilities();
  }, [user]);

  let title = meta?.name;
  if (meta?.title) {
    title = `${title} | ${meta?.title}`;
  }

  return ability ? (
    <AbilityContext.Provider value={ability}>
      <div className={styles.landing}>
        <Helmet>
          <meta charSet={meta.charSet} />
          <title>{title}</title>
        </Helmet>
        <ReactInterval timeout={timeout}
                       enabled={enabled}
                       callback={onNotification} />
        <Suspense fallback={<Loader fullScreen spinning={loading.effects['appModel/query']} />}>
          <Layout style={{ minHeight: '100vh' }} key={language}>
            <Layout className={styles.siteLayout}>
              <Content>
                <Form.Provider>
                  <div className={styles.siteLayoutContent}>{children}</div>
                </Form.Provider>
              </Content>
            </Layout>
          </Layout>
        </Suspense>
      </div>
    </AbilityContext.Provider>
  ) : (
    <Loader fullScreen spinning={true} />
  );
};

export default withRouter(
  connect(
    ({ appModel, authModel, loading }) => {
      return {
        appModel,
        authModel,
        loading
      };
    },
    (dispatch) => ({
      dispatch,
      onNotification() {
        dispatch({ type: 'appModel/notification' });
      },
      onDefineAbilities() {
        dispatch({ type: 'authModel/defineAbilities' });
      },
      onUpdateDocumentMeta(meta) {
        dispatch({ type: 'appModel/updateDocumentMeta', payload: { meta } });
      }
    })
  )(LandingLayout)
);
