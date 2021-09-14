import { connect } from 'dva';
import React from 'react';
import { Col, Row, Layout } from 'antd';
import { withTranslation } from 'react-i18next';
import { NavLink } from 'umi';

import styles from 'components/Footer/footer.module.less';

const { Footer } = Layout;

const footer = props => {
  const {t} = props;

  return (
    <Footer className={styles.footer}>
      <Row>
        <Col span={8}>
          <NavLink to={`/termsOfUse`}>
            {t('landing:termsOfUse')}
          </NavLink>
        </Col>
        <Col span={8}>
          <NavLink to={`/privacyPolicy`}>
            {t('landing:privacyPolicy')}
          </NavLink>
        </Col>
        <Col span={8}>
          <NavLink to={`/aboutUs`}>
            {t('landing:aboutUs')}
          </NavLink>
        </Col>
      </Row>
    </Footer>
  )
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
)(withTranslation()(footer));