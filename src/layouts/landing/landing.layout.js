import React, { Suspense } from 'react';
import { Helmet } from 'umi';
import { Form, Layout } from 'antd';
import ReactInterval from 'react-interval';
import ReactGA from 'react-ga4';

import Loader from '@/components/Loader';

import { AbilityContext } from '@/utils/auth/can';

import { effectHook } from '@/utils/hooks';
import '@/utils/i18n';

import styles from './landing.layout.module.less';

const { Content } = Layout;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const LandingLayout = (props) => {
  const {
    children,
    appModel,
    authModel,
    loading,
    onNotification,
    onOnline
  } = props;

  const {
    language = 'en-US',
    meta,
    interval: { timeout, enabled },
    layoutOpts: {}
  } = appModel;

  const { user, ability } = authModel;

  effectHook(() => {
    ReactGA.initialize('G-N3Y3KDBNCV');
    ReactGA.send('pageview');
  });

  effectHook(() => {
    props.onDefineAbilities();
  }, [user]);

  let title = meta?.name;
  if (meta?.title) {
    title = `${title} ${meta?.title}`;
  }

  return ability ? (
      <AbilityContext.Provider value={ability}>
        <div className={styles.landing}>
          <Helmet>
            <meta charSet={meta.charSet}/>
            <title>{title}</title>
          </Helmet>
          <ReactInterval timeout={timeout}
                         enabled={enabled}
                         callback={onNotification}/>
          <ReactInterval timeout={10000}
                         enabled={enabled}
                         callback={onOnline}/>
          <Suspense fallback={<Loader fullScreen spinning={loading.effects['appModel/query']}/>}>
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
      <Loader fullScreen spinning={true}/>
  );
};
