import { connect } from 'dva';
import React from 'react';
import { Layout } from 'antd';
import { withTranslation } from 'react-i18next';

import styles from 'components/Footer/footer.module.less';

const { Footer } = Layout;

const footer = props => {
  const {t} = props;

  return (
    <Footer className={styles.footer}>

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
