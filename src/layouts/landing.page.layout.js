import React, { useEffect } from 'react';
import { connect } from 'dva';
import { withTranslation } from 'react-i18next';

import { Layout, Spin } from 'antd';

import Footer from 'components/Footer';
import ScrollToTop from 'components/ScrollToTop';
import HeaderSection from 'pages/landing/sections/header.section';

import styles from 'pages/landing/landing.module.less';
import stylesPage from 'layouts/landing.page.layout.module.less';

const { Content } = Layout;

/**
 * @export
 * @default
 * @param props
 * @return {JSX.Element}
 */
const landingPage = (props) => {
  const {
    t,
    landingModel,
    authModel,
    loading,
    onSignOut,
    children
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

  return (
    <Spin spinning={loading.effects['landingModel/query']}>
      <Layout className={styles.landing}>
        <Content>
          <div className={styles.page}>
            <HeaderSection {...headerProps} />
            <div className={stylesPage.pageContent}>
              {children}
            </div>
          </div>
        </Content>
        <Footer />
      </Layout>
      <ScrollToTop topUnder={topUnder} />
    </Spin>
  );
};

export default connect(
  ({ landingModel, authModel, loading }) => {
    return {
      landingModel,
      authModel,
      loading
    };
  },
  (dispatch) => ({
    dispatch,
    onSignOut() {
      dispatch({ type: 'authModel/signOut', payload: {} });
    }
  })
)(withTranslation()(landingPage));
