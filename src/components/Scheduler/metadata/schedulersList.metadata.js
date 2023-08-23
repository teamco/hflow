import React from 'react';

import { t } from '@/utils/i18n';
import { tsToLocaleDateTime } from '@/utils/timestamp';

import {
  handleMonthly,
  handleWeekly,
  handleYearly
} from '@/components/Scheduler/metadata/metadata.handlers';
import DropdownButton from '@/components/Buttons/dropdown.button';
import { schedulerMenu } from '@/components/Scheduler/metadata/scheduler.menu';

import tableStyles from '@/components/Main/Table/table.module.less';

export const metadata = (props) => {
  const {
    ability,
    component,
    MODEL_NAME,
    prefix,
    disabled = false,
    intl,
    loading,
    filterable = false,
    sortable = false,
    onOpenSiderPanel,
    onDeleteScheduler
  } = props;

  const menuProps = {
    loading,
    ability,
    disabled,
    component,
    MODEL_NAME,
    prefix,
    intl,
    onOpenSiderPanel,
    onDeleteScheduler
  };

  return {
    width: '100%',
    size: 'middle',
    scroll: { x: 700 },
    columns: [
      {
        title: t(intl, 'scheduler.meta.duration'),
        dataIndex: 'duration',
        key: 'duration',
        width: 100,
        render(duration) {
          return `${duration.period} (${duration.type})`;
        }
      },
      {
        title: t(intl, 'scheduler.duration'),
        render(record = {}) {
          const { duration, repeat = {} } = record;
          const { weekly, monthly, yearly } = repeat;

          let _repeat = '';
          switch (duration.type) {
            case 'Day':
              // TODO (teamco): Do something.
              break;
            case 'Week':
              _repeat = handleWeekly(weekly);
              break;
            case 'Month':
              _repeat = handleMonthly(monthly, weekly);
              break;
            case 'Year':
              _repeat = handleYearly(yearly, monthly, weekly);
              break;
          }

          return _repeat;
        }
      },
      {
        title: t(intl, 'scheduler.startedAt'),
        dataIndex: 'range',
        key: 'range',
        render: range => tsToLocaleDateTime(+(new Date(range.startedAt)))
      },
      {
        title: t(intl, 'scheduler.duration.end'),
        dataIndex: 'range',
        key: 'range',
        render: ({ endReason }) => {
          const { type, expiredAt, occurrences } = endReason;
          let reason;

          if (type === 'Date') {
            reason = tsToLocaleDateTime(+(new Date(expiredAt)));
          } else if (type === 'Number') {
            reason = `${occurrences} ${t(intl, 'scheduler.occurrences')}`;
          } else {
            reason = t(intl, 'scheduler.duration.end.no');
          }

          return reason;
        }
      },
      {
        title: t(intl, 'table.action'),
        fixed: 'right',
        width: 180,
        className: tableStyles.tdCenter,
        render: (record) => (
            <DropdownButton key={'manage'}
                            spinOn={[
                              `schedulerModel/handleScheduler`,
                              `schedulerModel/deleteScheduler`
                            ]}
                            overlay={schedulerMenu({ record, ...menuProps })}
                            data-testid={'scheduler-mng'}
                            disabled={disabled}
                            loading={loading}
                            label={t(intl, 'scheduler.actions.manage')}/>
        )
      }
    ],
    loading: loading.effects['userModel/query']
  };
};
