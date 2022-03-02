import React from 'react';
import { useIntl } from 'umi';

/**
 * @export
 * @param t
 * @param data
 * @param loading
 * @return {*}
 */
export const userLogsMetadata = ({
  data,
  loading
}) => {
  const intl = useIntl();
  return {
    width: '100%',
    size: 'middle',
    columns: [
      {
        title: intl.formatMessage({id: 'logs.eventType', defaultMessage: 'Event'}),
        dataIndex: 'eventType',
        key: 'eventType',
        filterable: true,
        sortable: true
      },
      {
        title: intl.formatMessage({id: 'logs.namespace', defaultMessage: 'Model'}),
        dataIndex: 'namespace',
        key: 'namespace',
        filterable: true,
        sortable: true
      },
      {
        title: intl.formatMessage({id: 'form.createdAt', defaultMessage: 'Created at'}),
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: createdAt => {
          const date = new Date(createdAt);
          return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        }
      }
    ],
    loading: loading.effects['userLogModel/query']
  }
};
