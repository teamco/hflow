import React, { useEffect } from 'react';
import { BackTop, Layout, Spin } from 'antd';

import Footer from 'components/Footer';
import HeaderSection from 'pages/landing/sections/header.section';

import styles from 'pages/landing/landing.module.less';
import stylesPage from 'layouts/landing/page/landing.page.layout.module.less';

const { Content } = Layout;

/**
 * @export
 * @default
 * @param props
 * @return {JSX.Element}
 */
export const LandingPage = (props) => {
  const {
    t,
    landingModel,
    authModel,
    loading,
    onSignOut,
    children,
    spinEffects = [],
    pageStyles = stylesPage.pageContent
  } = props;

  useEffect(() => {
  }, []);

  const {
    topUnder,
    swipeData
  } = landingModel;

  const {
    user
  } = authModel;

  const headerProps = {
    swipeProps: swipeData,
    user,
    topUnder,
    onSignOut
  };

  const spinning = Object.keys(loading.effects).
      filter(effect =>
          spinEffects.indexOf(effect) > -1 &&
          loading.effects[effect]
      );

  const isSpinning = spinning.length ||
      loading.effects['landingModel/query'];

  return (
      <Spin spinning={isSpinning}>
        <Layout className={styles.landing}>
          <HeaderSection {...headerProps} />
          <Content>
            <div className={styles.page}>
              <div className={pageStyles}>
                {children}
              </div>
            </div>
          </Content>
          <Footer />
        </Layout>
        <BackTop/>
      </Spin>
  );
};
