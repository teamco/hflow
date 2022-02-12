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
function page500({ t, component, errorModel }) {
  return (
      <Page component={'page500'}>
        <Result status={'500'}
                title={'500'}
                className={styles.page500}
                subTitle={t('error:page500')}/>
      </Page>
  );
}

export default connect(({ errorModel, loading }) => ({
      errorModel,
      loading
    }),
    dispatch => ({})
)(withTranslation()(page500));
