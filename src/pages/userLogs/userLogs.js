import React, { useRef } from 'react';
import ReactJson from 'react-json-view';
import { useIntl } from '@umijs/max';
import { UserSwitchOutlined } from '@ant-design/icons';

import Page from '@/components/Page/page.connect';
import Main from '@/components/Main';
import { SubHeader } from '@/components/Page/page.subheader';

import { userLogsMetadata } from '@/pages/userLogs/userLogs.metadata';

import { effectHook } from '@/utils/hooks';
import { t } from '@/utils/i18n';
import { componentAbilities } from '@/utils/auth/component.setting';

import styles from '@/pages/userLogs/userLogs.module.less';

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
        {t(intl, 'user.actions.manage')}
      </>
  );

  const component = 'user.logs';
  const {
    ability,
    disabled,
    canUpdate,
    canDelete,
    canExport,
    canRead
  } = componentAbilities(authModel, component, true);

  const refTarget = useRef(null);

  const pageHeaderProps = {
    subTitle,
    loading,
    disabled,
    component,
    actions: {
      closeBtn: false,
      saveBtn: false,
      menuBtn: false,
      newBtn: false,
      exportBtn: { refTarget, data, disabled: !canExport }
    }
  };

  return (
      <Page className={styles.userLogs}
            component={component}
            spinEffects={['authModel/defineAbilities']}>
        <SubHeader {...pageHeaderProps}/>
        <Table data={data}
               expandable={{
                 expandedRowRender(record) {
                   return (
                       <div className={styles.logInfo}>
                         <div>
                           <strong>{t(intl, 'form.createdBy')}</strong>
                           <span>{record.createdBy || t(intl, 'auth.anonymous')}</span>
                         </div>
                         <div>
                           <strong>{t(intl, 'logs.referrer')}</strong>
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
