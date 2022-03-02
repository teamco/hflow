import React from 'react';
import { connect, useIntl } from 'umi';
import { Result } from 'antd';
import Page from '@/components/Page';

import styles from 'layouts/app/app.layout.less';

/**
 * @function
 * @param t
 * @param component
 * @param errorModel
 * @return {JSX.Element}
 */
function page500({ component, errorModel }) {
  return (
      <Page component={'page500'}>
        <Result status={'500'}
                title={'500'}
                className={styles.page500}
                subTitle={intl.formatMessage({id: 'error.page500', defaultMessage: 'Sorry, something went wrong'})}/>
      </Page>
  );
}

export default connect(({ errorModel, loading }) => ({
      errorModel,
      loading
    }),
    dispatch => ({})
)(page500);
