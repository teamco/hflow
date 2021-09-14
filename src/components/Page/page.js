import React from 'react';
import { connect } from 'dva';
import { Layout, Row, Spin } from 'antd';
import classnames from 'classnames';
import { withTranslation } from 'react-i18next';

import Page403 from 'pages/403';
import { Can } from 'utils/auth/can';

import styles from 'components/Page/page.module.less';

const { Content } = Layout;

function Page({
  t,
  loading,
  spinEffects = [],
  children,
  className,
  component
}) {

  const spinning = Object.keys(loading.effects).
    filter(effect =>
      spinEffects.indexOf(effect) > -1 &&
      loading.effects[effect]
    );

  return (
    <Layout className={classnames(styles.layout)}>
      <Layout className={'site-layout'}>
        <Content className={classnames(styles.page, className)}>
          <Row style={{ height: '100%' }}>
            <Spin spinning={spinning.length > 0}>
              <Can I={'read'} a={component}>
                {children}
              </Can>
              <Page403 component={component} />
            </Spin>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
}

export default connect(
  ({ pageModel, loading }) => {
    return {
      pageModel,
      loading
    };
  },
  (dispatch) => ({
    dispatch
  })
)(withTranslation()(Page));
