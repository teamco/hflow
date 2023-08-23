import React, { useState } from 'react';
import { Tabs } from 'antd';
import {
  InboxOutlined,
  NotificationOutlined,
  SendOutlined
} from '@ant-design/icons';
import { useParams, useIntl } from '@umijs/max';

import Page from '@/components/Page/page.connect';
import Main from '@/components/Main';
import { SubHeader } from '@/components/Page/page.subheader';

import SendMessage from '@/pages/users/metadata/send.message';

import { notificationsMetadata } from './notifications.metadata';
import { expendableNotification } from './metadata/notification.expendable';

import { effectHook } from '@/utils/hooks';
import { t } from '@/utils/i18n';

import styles from './notifications.module.less';

const { Table } = Main;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export const notifications = (props) => {
  const intl = useIntl();

  const {
    authModel,
    notificationModel,
    loading,
    onQuery,
    onRead,
    onSendMessage
  } = props;

  const { user } = authModel;
  const { notifications = {} } = notificationModel;

  /**
   * @type {{user}}
   */
  const params = useParams();

  const [visibleMessage, setVisibleMessage] = useState(
      { visible: false, props: {} });
  const [activeTab, setActiveTab] = useState('inbox');

  effectHook(() => {
    user && onQuery(params?.user);
  }, [user]);

  const subTitle = (
      <>
        <NotificationOutlined style={{ marginRight: 10 }}/>
        {t(intl, 'notifications.actions.manage')}
      </>
  );

  const { ability } = authModel;
  const component = 'notifications';
  const disabled = !ability.can('read', component);

  const tableProps = {
    expandable: expendableNotification({ setVisibleMessage }),
    onExpand(expanded, record) {
      if (activeTab === 'inbox' && !record.read) {
        onRead(record.id);
      }
    }
  };

  const sendProps = {
    onSendMessage,
    visibleMessage,
    setVisibleMessage
  };

  const items = [
    {
      label: (
          <>
            <InboxOutlined />
            {t(intl, 'notifications.inbox')}
          </>
      ),
      key: 'inbox',
      disabled,
      children: (
          <Table data={notifications.inbox}
                 {...tableProps}
                 {...notificationsMetadata({ loading })} />
      )
    },
    {
      label: (
          <>
            <SendOutlined/>
            {t(intl, 'notifications.sent')}
          </>
      ),
      key: 'sent',
      disabled,
      children: (
          <Table data={notifications.sent}
                 {...tableProps}
                 {...notificationsMetadata({ loading })} />)
    }
  ];

  const pageHeaderProps = {
    subTitle,
    loading,
    disabled,
    component,
    actions: {
      exportBtn: false,
      closeBtn: false,
      saveBtn: false,
      newBtn: false,
      menuBtn: false
    }
  };

  return (
      <Page className={styles.notifications}
            component={component}
            spinEffects={[
              'authModel/defineAbilities',
              'notificationModel/query'
            ]}>
        <SubHeader {...pageHeaderProps}/>
        <Tabs activeKey={activeTab}
              className={styles.tabs}
              onChange={key => {
                setActiveTab(key);
                onQuery(params?.user, key);
              }}
              tabPosition={'left'}
              items={items}/>
        <SendMessage {...sendProps}/>
      </Page>
  );
};
