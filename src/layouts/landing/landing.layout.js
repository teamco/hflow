import React, { Suspense } from 'react';
import * as umi from '@umijs/max';
import { FloatButton, Form, Layout, message } from 'antd';
import ReactInterval from 'react-interval';
import { useScrollIndicator } from 'react-use-scroll-indicator';

import Loader from '@/components/Loader';

import { AbilityContext } from '@/utils/auth/can';
import { effectHook } from '@/utils/hooks';
import { logger } from '@/utils/console';

import { locales } from '@/locales';

import styles from './landing.layout.module.less';

const { Content } = Layout;

const { Outlet, Helmet, IntlProvider, useIntl } = umi;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const LandingLayout = (props) => {
  const intl = useIntl();

  const {
    appModel,
    authModel,
    loading,
    onNotification,
    onRefreshSignIn,
    onHandleMessageApi,
    onUpdateLocales,
    onOnline,
    onDefineAbilities
  } = props;

  const {
    language = 'en-US',
    meta,
    location,
    interval: { timeout, enabled }
  } = appModel;

  const [messageApi, contextHolder] = message.useMessage();

  const { user, ability, userSignOut } = authModel;

  const messages = locales[`${language}`] || {};

  effectHook(() => {
    onDefineAbilities();
  }, [user]);

  let title = meta?.name;
  if (meta?.title) {
    title = `${title} ${meta?.title}`;
  }

  effectHook(() => {
    onRefreshSignIn();
    onUpdateLocales(messages);
    onHandleMessageApi(messageApi, intl);
  });

  userSignOut?.error && logger({
    type: userSignOut?.error ? 'error' : 'info',
    error: userSignOut?.error,
    isSignedOut: userSignOut?.fbSignOut
  });

  const [state] = useScrollIndicator();

  const progress = state?.value;

  const content = (
      <Layout style={{ minHeight: '100vh' }} key={language}>
        <Layout className={styles.siteLayout}>
          <Content>
            <Form.Provider>
              <div className={styles.siteLayoutContent}>
                <Suspense fallback={(
                    <Loader loading={loading} spinOn={['appModel/query']}/>
                )}>
                  <Outlet/>
                </Suspense>
                <FloatButton.BackTop/>
              </div>
            </Form.Provider>
          </Content>
        </Layout>
      </Layout>
  );

  return ability ? (
      <AbilityContext.Provider value={ability}>
        <IntlProvider locale={language}
                      messages={messages}>
          <div className={styles.landing}>
            <Helmet>
              <meta charSet={meta.charSet}/>
              <link rel={'manifest'} href={'/worker/manifest.json'}/>
              <title>{title}</title>
            </Helmet>
            <ReactInterval timeout={timeout}
                           enabled={enabled}
                           callback={onNotification}/>
            {contextHolder}
            <div className={styles.progress}
                 style={{ width: `${progress}%` }}/>
            <Loader loading={loading} spinOn={[
              'authModel/updateToken',
              'appModel/handleMessageApi'
            ]}>
              {content}
            </Loader>
          </div>
        </IntlProvider>
      </AbilityContext.Provider>
  ) : (
      <Loader loading={loading}
              className={styles.loaderInit}
              spinning={true}/>
  );
};
