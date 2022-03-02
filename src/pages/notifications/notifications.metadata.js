import React from 'react';
import { useIntl } from 'umi';

/**
 * @export
 * @param t
 * @param loading
 * @return {*}
 */
export const notificationsMetadata = ({ loading }) => {
  const intl = useIntl();
  return {
    width: '100%',
    size: 'middle',
    columns: [
      {
        title: intl.formatMessage({id: 'notifications.type', defaultMessage: 'Type'}),
        dataIndex: 'type',
        key: 'type',
        filterable: true,
        sortable: true
      },
      {
        title: intl.formatMessage({id: 'table.title', defaultMessage: 'Title'}),
        dataIndex: 'title',
        key: 'title',
        filterable: true,
        sortable: true,
        render(title, record) {
          return record.read ? title : (<strong>{title}</strong>);
        }
      },
      {
        title: intl.formatMessage({id: 'notifications.status', defaultMessage: 'Status'}),
        dataIndex: 'status',
        key: 'status',
        filterable: true,
        sortable: true
      },
      {
        title: intl.formatMessage({id: 'form.createdAt', defaultMessage: 'Created at'}),
        dataIndex: 'metadata',
        key: 'metadata',
        render(metadata) {
          const date = new Date(metadata.createdAt);
          return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        }
      }
    ],
    loading: loading.effects['notifications/query']
  }
};
