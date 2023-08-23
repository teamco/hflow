import {
  handleMsg,
  handleMultipleDurations,
  handleSelectWeeklyDay
} from '@/components/Scheduler/handlers';

import { stub } from '@/utils/function';
import { t } from '@/utils/i18n';

/**
 * @export
 * @param duration
 * @param repeat
 * @param intl
 * @param formRef
 * @param prefix
 * @param {function} [setPeriod]
 * @return {*}
 */
export const monthHandler = (duration, repeat, { intl, formRef, prefix, setPeriod = stub }) => {
  const _weekDays = repeat?.weekly?.days;

  const msg = handleMsg({
    singular: 'scheduler.month',
    plural: 'scheduler.months'
  }, duration?.period, intl);

  const _monthPeriod = repeat?.monthly || {};

  if (_monthPeriod?.type === 'Day') {
    const monthDay = _monthPeriod?.monthDay;

    handleSelectWeeklyDay(
        monthDay,
        duration,
        repeat,
        { intl, formRef, setPeriod, prefix },
        { msg }
    );
  } else if (_monthPeriod?.type === 'Period') {
    const _the = t(intl, 'scheduler.separator.the');
    const _of = t(intl, 'scheduler.separator.of');
    const _every = t(intl, 'scheduler.separator.every');
    const _which = _monthPeriod.weekDay;

    const _days = handleMultipleDurations(intl, _weekDays);

    setPeriod(`${_the} ${_which} ${_days} ${_of} ${_every} ${msg}`);
  }
};