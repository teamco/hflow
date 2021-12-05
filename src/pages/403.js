import React from 'react';
import { connect } from 'dva';
import { Result } from 'antd';
import Page from 'components/Page';
import { withTranslation } from 'react-i18next';

import styles from 'layouts/app/app.layout.less';
import { Can } from 'utils/auth/can';

/**
 * @function
 * @param t
 * @param component
 * @param errorModel
 * @return {JSX.Element}
 */
function page403({ t, component, errorModel }) {

  const _403 = (
        <Page component={'page403'}>
          <Result status={'403'}
                  title={'403'}
                  className={styles.page403}
                  subTitle={t('error:page403')}/>
        </Page>
  );

  return component ? (
      <Can not I={'read'} a={component}>{_403}</Can>
  ) : _403;
}

export default connect(({ errorModel, loading }) => ({
      errorModel,
      loading
    }),
    dispatch => ({})
)(withTranslation()(page403));
