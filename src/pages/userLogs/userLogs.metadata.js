import React from 'react';
import { useIntl } from '@umijs/max';

import { t } from '@/utils/i18n';

/**
 * @export
 * @param data
 * @param loading
 * @return {*}
 */
export const userLogsMetadata = ({ data, loading }) => {
  const intl = useIntl();
  
  return {
    width: '100%',
    size: 'middle',
    columns: [
      {
        title: t(intl, 'logs.eventType'),
        dataIndex: 'eventType',
        key: 'eventType',
        filterable: true,
        sortable: true
      },
      {
        title: t(intl, 'logs.namespace'),
        dataIndex: 'namespace',
        key: 'namespace',
        filterable: true,
        sortable: true
      },
      {
        title: t(intl, 'form.createdAt'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: createdAt => {
          const date = new Date(createdAt);
          return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        }
      }
    ],
    loading: loading.effects['userLogModel/query']
  };
};
