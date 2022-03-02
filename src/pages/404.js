import React from 'react';
import { connect, useIntl } from 'umi';
import { Result } from 'antd';
import Page from '@/components/Page';

import styles from 'layouts/app/app.layout.less';

/**
 * @function
 * @param t
 * @param errorModel
 * @return {JSX.Element}
 */
function page404({ t, errorModel }) {
  const intl = useIntl();
  return (
      <Page component={'page404'}>
        <Result status={'404'}
                title={'404'}
                className={styles.page404}
                subTitle={intl.formatMessage({id: 'error.page404', defaultMessage: 'Sorry, the page you visited does not exist'})}/>
      </Page>
  );
}

export default connect(({ errorModel, loading }) => ({
      errorModel,
      loading
    }),
    dispatch => ({})
)(page404);
