import Page from 'components/Page';
import React, { useEffect } from 'react';
import { connect } from 'dva';
import { withTranslation } from 'react-i18next';

import styles from 'pages/home/home.module.less';

const home = (props) => {
  const { t, pageModel, loading } = props;

  useEffect(() => {
  }, []);

  const component = 'home';

  return (
    <Page className={styles.home}
          component={component}>
      Home
    </Page>
    );
};

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
)(withTranslation()(home));
