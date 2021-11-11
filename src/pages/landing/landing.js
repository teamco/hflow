import React, { useEffect } from 'react';
import { Layout, Spin } from 'antd';

import HeaderSection from 'pages/landing/sections/header.section';
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
    topUnder
  } = landingModel;

  const {
    user
  } = authModel;

  useEffect(() => {
  }, []);

  const headerProps = {
    user,
    topUnder,
    onSignOut
  };

  return (
      <Spin spinning={loading.effects['landingModel/query']}>
        <Layout className={styles.landing}>
          <Content>
            <div className={styles.page}>
              <HeaderSection {...headerProps} />
            </div>
          </Content>
          <Footer/>
        </Layout>
      </Spin>
  );
};
