import React from 'react';
import { Layout, Spin } from 'antd';

import HeaderSection from '@/pages/landing/sections/header.section';

import { isSpinning } from '@/utils/state';

import styles from '@/pages/landing/landing.module.less';
import stylesPage from '@/layouts/landing/page/landing.page.layout.module.less';
import ModelLoader from '@/components/Main/ModelLoader';

const { Content } = Layout;

/**
 * @export
 * @default
 * @param props
 * @return {JSX.Element}
 */
export const LandingPage = (props) => {
  const {
    landingModel,
    notificationModel,
    authModel,
    userModel,
    appModel,
    loading,
    onSignOut,
    spinEffects = [],
    pageStyles = stylesPage.pageContent,
    onChangeLang
  } = props;

  const {
    icon,
    topUnder,
    header: { position }
  } = landingModel;

  const { user } = authModel;

  const headerProps = {
    icon,
    user,
    topUnder,
    onSignOut,
    position,
    notificationModel,
    landingModel,
    authModel,
    userModel,
    onChangeLang,
    loading
  };

  const spinOn = [
    ...spinEffects,
    'landingModel/query',
    'profileModel/query',
    'profileModel/updateActionBtns'
  ];

  const spinning = isSpinning(loading, spinOn, false, true);

  return (
      <Layout className={styles.landing}>
        <Content>
          <div className={styles.page}>
            <HeaderSection {...headerProps} />
            <Spin spinning={!!spinning}
                  tip={(
                      <ModelLoader loading={loading}
                                   spinEffects={spinOn}/>
                  )}>
              <div className={pageStyles}>
                {props.children}
              </div>
            </Spin>
          </div>
        </Content>
      </Layout>
  );
};
