import { handleMsg, handleMultipleDurations } from '@/components/Scheduler/handlers';
import { stub } from '@/utils/function';
import { t } from '@/utils/i18n';

/**
 * @export
 * @param intl
 * @param repeat
 * @param duration
 * @param {function} [setPeriod]
 * @return {`${*} ${string}`}
 */
export const weekHandler = (duration, repeat, { intl, setPeriod = stub }) => {
  const _weekPeriod = repeat?.weekly?.days || [];

  const msg = handleMsg({
    singular: 'scheduler.week',
    plural: 'scheduler.weeks'
  }, duration?.period, intl);

  const _day = t(intl, 'scheduler.separator.day');
  const _on = t(intl, 'scheduler.separator.on');
  const _every = t(intl, 'scheduler.separator.every');

  const _daysPeriod = _weekPeriod?.length === 7 ? _day :
      handleMultipleDurations(intl, _weekPeriod);

  if (duration?.period === 1) {
    setPeriod(`${_every} ${_daysPeriod}`);
  } else {
    setPeriod(`${_every} ${msg} ${_on} ${_daysPeriod}`);
  }
};