import React, { useEffect, useState } from 'react';
import { PageHeader, Tabs } from 'antd';
import { NotificationOutlined } from '@ant-design/icons';
import { useParams } from 'umi';

import Page from 'components/Page';
import Main from 'components/Main';

import { notificationsMetadata } from 'pages/notifications/notifications.metadata';
import { expendableNotification } from 'pages/notifications/metadata/notification.expendable';

import styles from 'pages/notifications/notifications.module.less';
import SendMessage from '../users/metadata/send.message';

const { Table } = Main;
const { TabPane } = Tabs;

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
    onQuery,
    onRead,
    onSendMessage
  } = props;

  const {
    notifications = {}
  } = notificationModel;

  /**
   * @type {{user}}
   */
  const params = useParams();

  const [visibleMessage, setVisibleMessage] = useState({ visible: false, props: {} });
  const [activeTab, setActiveTab] = useState('inbox');

  useEffect(() => {
    onQuery(params?.user);
  }, []);

  const subTitle = (
      <>
        <NotificationOutlined style={{ marginRight: 10 }}/>
        {t('actions:manage', { type: t('menu:notifications') })}
      </>
  );

  const { ability } = authModel;
  const component = 'notifications';
  const disabled = !ability.can('read', component);

  const tableProps = {
    expandable: expendableNotification({ t, setVisibleMessage }),
    onExpand(expanded, record) {
      if (activeTab === 'inbox' && !record.read) {
        onRead(record.id);
      }
    }
  };

  const sendProps = {
    t,
    onSendMessage,
    visibleMessage,
    setVisibleMessage
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
        <Tabs defaultActiveKey={'inbox'}
              onChange={key => setActiveTab(key)}
              tabPosition={'left'}>
          <TabPane tab={t('notifications:inbox')} key={'inbox'}>
            <Table data={notifications.inbox}
                   {...tableProps}
                   {...notificationsMetadata({ t, loading })} />
          </TabPane>
          <TabPane tab={t('notifications:sent')} key={'sent'}>
            <Table data={notifications.sent}
                   {...tableProps}
                   {...notificationsMetadata({ t, loading })} />
          </TabPane>
        </Tabs>
        <SendMessage {...sendProps}/>
      </Page>
  );
};
