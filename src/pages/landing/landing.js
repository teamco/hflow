import React, { useEffect } from 'react';
import { connect } from 'dva';

import { withTranslation } from 'react-i18next';
import { Layout, Spin } from 'antd';

import HeaderSection from 'pages/landing/sections/header.section';
import Footer from 'components/Footer';

import styles from 'pages/landing/landing.module.less';

const { Content } = Layout;

const landing = (props) => {
  const {
    t,
    authModel,
    landingModel,
    watch = true,
    loading,
    onSignOut
  } = props;

  const {
    topUnder,
    swipeData,
    discoveryData,
    serviceData,
    missionData
  } = landingModel;

  const {
    user
  } = authModel;

  useEffect(() => {
  }, []);

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
          </div>
        </Content>
        <Footer />
      </Layout>
    </Spin>
  );
};

export default connect(
  ({ authModel, landingModel, loading }) => {
    return {
      authModel,
      landingModel,
      loading
    };
  },
  (dispatch) => ({
    dispatch,
    onSignOut() {
      dispatch({ type: 'authModel/signOut', payload: {} });
    }
  })
)(withTranslation()(landing));
