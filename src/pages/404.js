import React from 'react';
import {connect} from 'dva';
import {Result} from 'antd';
import Page from 'components/Page';
import {withTranslation} from 'react-i18next';

import styles from 'layouts/app/app.layout.less';

/**
 * @function
 * @param t
 * @param errorModel
 * @return {JSX.Element}
 */
function page404({ t, errorModel }) {

  return (
    <Page component={'page404'}>
      <Result status={'404'}
              title={'404'}
              className={styles.page404}
              subTitle={t('error:page404')} />
    </Page>
  );
}

export default connect(({ errorModel, loading }) => ({
    errorModel,
    loading
  }),
  dispatch => ({})
)(withTranslation()(page404));
