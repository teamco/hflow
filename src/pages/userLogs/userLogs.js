import React  from 'react';
import ReactJson from 'react-json-view';
import { useIntl } from 'umi';
import Page from '@/components/Page';
import Main from '@/components/Main';

import { userLogsMetadata } from 'pages/userLogs/userLogs.metadata';
import { PageHeader } from 'antd';
import { UserSwitchOutlined } from '@ant-design/icons';

import styles from 'pages/userLogs/userLogs.module.less';
import { effectHook } from '@/utils/hooks';

const { Table } = Main;

export const userLogs = (props) => {
  const intl = useIntl();
  const {
    authModel,
    userLogModel,
    loading,
    onQuery
  } = props;

  const {
    data = []
  } = userLogModel;

  effectHook(() => {
    onQuery();
  }, []);

  const subTitle = (
      <>
        <UserSwitchOutlined style={{ marginRight: 10 }}/>
        {intl.formatMessage({id: 'user.actions.manage', defaultMessage: 'Manage User'})}
      </>
  );

  const { ability } = authModel;
  const component = 'userLogs';
  const disabled = !ability.can('read', component);

  return (
      <Page className={styles.userLogs}
            component={component}
            spinEffects={['authModel/defineAbilities']}>
        <PageHeader ghost={false}
                    subTitle={subTitle}/>
        <Table data={data}
               expandable={{
                 expandedRowRender(record) {
                   return (
                       <div className={styles.logInfo}>
                         <div>
                           <strong>{intl.formatMessage({id: 'form.createdBy', defaultMessage: 'Created by'})}</strong>
                           <span>{record.createdBy || intl.formatMessage({id: 'auth.anonymous', defaultMessage: 'Anonymous'})}</span>
                         </div>
                         <div>
                           <strong>{intl.formatMessage({id: 'logs.referrer', defaultMessage: 'Referral URL'})}</strong>
                           <a href={record.referrer}>{record.referrer}</a>
                         </div>
                         <ReactJson src={record.metadata}
                                    theme={'monokai'}/>
                       </div>
                   );
                 },
                 rowExpandable: record => record.eventType
               }}
               {...userLogsMetadata({
                 data,
                 loading
               })} />
      </Page>
  );
};
