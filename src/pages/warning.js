import React from 'react';
import { connect } from 'umi';
import { Result } from 'antd';
import Page from '@/components/Page';
import { withTranslation } from 'react-i18next';

import styles from 'layouts/app/app.layout.less';

/**
 * @function
 * @param t
 * @param component
 * @param errorModel
 * @return {JSX.Element}
 */
function pageWarning({ t, component, errorModel }) {
  return (
      <Page component={'pageWarning'}>
        <Result status={'warning'}
                title={t('error:pageWarning')}
                className={styles.pageWarning}/>
      </Page>
  );
}

export default connect(({ errorModel, loading }) => ({
      errorModel,
      loading
    }),
    dispatch => ({})
)(withTranslation()(pageWarning));
