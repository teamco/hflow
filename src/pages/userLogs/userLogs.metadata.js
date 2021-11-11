import React from 'react';

/**
 * @export
 * @param t
 * @param data
 * @param loading
 * @return {*}
 */
export const userLogsMetadata = ({
  t,
  data,
  loading
}) => ({
  width  : '100%',
  size   : 'middle',
  columns: [
    {
      title     : t('logs:eventType'),
      dataIndex : 'eventType',
      key       : 'eventType',
      filterable: true,
      sortable  : true
    },
    {
      title     : t('logs:namespace'),
      dataIndex : 'namespace',
      key       : 'namespace',
      filterable: true,
      sortable  : true
    },
    {
      title    : t('form:createdAt'),
      dataIndex: 'createdAt',
      key      : 'createdAt',
      render   : createdAt => {
        const date = new Date(createdAt);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      }
    }
  ],
  loading: loading.effects['userLogModel/query']
});
