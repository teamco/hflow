import React, { useEffect } from 'react';
import { Layout, Spin } from 'antd';

import HeaderSection from 'pages/landing/sections/header.section';
import LandingContent from 'components/Landing/landing.content';
import Footer from 'components/Footer';

import styles from 'pages/landing/landing.module.less';

const { Content } = Layout;

export const landing = (props) => {
  const {
    t,
    authModel,
    landingModel,
    watch = true,
    loading,
    onSignOut
  } = props;

  const {
    icon,
    topUnder
  } = landingModel;

  const {
    user
  } = authModel;

  useEffect(() => {
  }, []);

  const headerProps = {
    icon,
    user,
    topUnder,
    onSignOut,
    position: 'fixed'
  };

  const contentProps = {
    className: headerProps.position === 'fixed' ? styles.contentFixed : null
  };

  return (
    <Spin spinning={loading.effects['landingModel/query']}>
      <Layout className={styles.landing}>
        <HeaderSection {...headerProps} />
        <Content>
          <div className={styles.page}>
            some page content
          </div>
        </Content>
        <Footer />
      </Layout>
    </Spin>
  );
};
