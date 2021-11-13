import React from 'react';

/**
 * @export
 * @param t
 * @param loading
 * @return {*}
 */
export const notificationsMetadata = ({ t, loading }) => ({
  width: '100%',
  size: 'middle',
  columns: [
    {
      title: t('notifications:type'),
      dataIndex: 'type',
      key: 'type',
      filterable: true,
      sortable: true
    },
    {
      title: t('table:title'),
      dataIndex: 'title',
      key: 'title',
      filterable: true,
      sortable: true,
      render(title, record) {
        return record.read ? title : (<strong>{title}</strong>);
      }
    },
    {
      title: t('notifications:status'),
      dataIndex: 'status',
      key: 'status',
      filterable: true,
      sortable: true
    },
    {
      title: t('form:createdAt'),
      dataIndex: 'metadata',
      key: 'metadata',
      render(metadata) {
        const date = new Date(metadata.createdAt);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      }
    }
  ],
  loading: loading.effects['notifications/query']
});
