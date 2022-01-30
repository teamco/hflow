import React  from 'react';
import ReactJson from 'react-json-view';

import Page from '@/components/Page';
import Main from '@/components/Main';

import { userLogsMetadata } from 'pages/userLogs/userLogs.metadata';
import { PageHeader } from 'antd';
import { UserSwitchOutlined } from '@ant-design/icons';

import styles from 'pages/userLogs/userLogs.module.less';
import { effectHook } from '@/utils/hooks';

const { Table } = Main;

export const userLogs = (props) => {
  const {
    t,
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
        {t('actions:manage', { type: t('user:logs') })}
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
                           <strong>{t('form:createdBy')}</strong>
                           <span>{record.createdBy || t('auth:anonymous')}</span>
                         </div>
                         <div>
                           <strong>{t('logs:referrer')}</strong>
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
                 t,
                 data,
                 loading
               })} />
      </Page>
  );
};
