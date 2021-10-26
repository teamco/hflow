import React, {useEffect} from 'react';
import {PageHeader} from 'antd';
import {NotificationOutlined} from '@ant-design/icons';

import Page from 'components/Page';
import Main from 'components/Main';

import {expendableNotification, notificationsMetadata} from 'pages/notifications/notifications.metadata';

import styles from 'pages/notifications/notifications.module.less';

const {Table} = Main;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export const notifications = (props) => {
  const {
    t,
    authModel,
    notificationModel,
    loading,
    onQuery
  } = props;

  const {
    notifications = []
  } = notificationModel;

  useEffect(() => {
    onQuery();
  }, []);

  const subTitle = (
      <>
        <NotificationOutlined style={{marginRight: 10}}/>
        {t('actions:manage', {type: t('menu:notifications')})}
      </>
  );

  const {ability} = authModel;
  const component = 'notifications';
  const disabled = !ability.can('read', component);

  const tableProps = {
    expandable: expendableNotification({t})
  };

  return (
      <Page className={styles.notifications}
            component={component}
            spinEffects={[
              'authModel/defineAbilities',
              'notificationModel/query'
            ]}>
        <PageHeader ghost={false}
                    subTitle={subTitle}/>
        <Table data={notifications}
               {...tableProps}
               {...notificationsMetadata({
                 t,
                 notifications,
                 loading
               })} />
      </Page>
  );
};
