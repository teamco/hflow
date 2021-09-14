import React, { useEffect } from 'react';
import { connect } from 'dva';
import { withTranslation } from 'react-i18next';
import ReactJson from 'react-json-view';

import Page from 'components/Page';
import Main from 'components/Main';

import { metadata } from 'pages/userLogs/metadata';
import styles from 'pages/userLogs/userLogs.module.less';

const { Table } = Main;

const userLogs = (props) => {
  const {
    t,
    userLogModel,
    loading,
    onQuery
  } = props;

  const {
    data = []
  } = userLogModel;

  useEffect(() => {
    onQuery();
  }, []);

  return (
    <Page className={styles.userLogs}>
      <Table data={data}
             expandable={{
               expandedRowRender(record) {
                 return (
                   <div className={styles.logInfo}>
                     <div>
                       <strong>{t('form:createdBy')}</strong>
                       <span>{record.createdBy || t('auth:anonymous')}</span>
                     </div>
                     <div>
                       <strong>{t('logs:referrer')}</strong>
                       <a href={record.referrer}>{record.referrer}</a>
                     </div>
                     <ReactJson src={record.metadata}
                                theme={'monokai'} />
                   </div>
                 );
               },
               rowExpandable: record => record.eventType
             }}
             {...metadata({
               t,
               data,
               loading
             })} />
    </Page>
  );
};

export default connect(
  ({ userLogModel, loading }) => {
    return {
      userLogModel,
      loading
    };
  },
  (dispatch) => ({
    dispatch,
    onQuery() {
      dispatch({ type: `userLogModel/query` });
    }
  })
)(withTranslation()(userLogs));
