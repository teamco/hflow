import React from 'react';
import { useIntl } from '@umijs/max';

import { t } from '@/utils/i18n';
import { adaptTranslations } from '@/locales';

/**
 * @export
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
        title: t(intl, 'notifications.type'),
        dataIndex: 'type',
        key: 'type',
        filterable: true,
        sortable: true,
        render(type) {
          return t(intl, adaptTranslations(type, 'notifications'));
        }
      },
      {
        title: t(intl, 'table.title'),
        dataIndex: 'title',
        key: 'title',
        width: 300,
        filterable: true,
        sortable: true,
        render(title, record) {
          return record.read ? title : (<strong>{title}</strong>);
        }
      },
      {
        title: t(intl, 'notifications.status'),
        dataIndex: 'status',
        key: 'status',
        filterable: true,
        sortable: true,
        render(status) {
          return t(intl, adaptTranslations(status, 'status'));
        }
      },
      {
        title: t(intl, 'form.createdAt'),
        dataIndex: 'metadata',
        key: 'metadata',
        render(metadata) {
          const date = new Date(metadata.createdAt);
          const options = {
            // https://www.jsman.net/manual/Standard-Global-Objects/Date/toLocaleTimeString
            year: 'numeric', month: 'short', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
          };
          return `${date.toLocaleTimeString('en-US', options)}`;
        }
      }
    ],
    loading: loading.effects['notifications/query']
  };
};
