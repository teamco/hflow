import { handleMsg, handleMultipleDurations } from '@/components/Scheduler/handlers';

import { stub } from '@/utils/function';
import { t } from '@/utils/i18n';

/**
 * @export
 * @param intl
 * @param duration
 * @param repeat
 * @param {function} [setPeriod]
 * @return {*}
 */
export const yearHandler = (duration, repeat, { intl, setPeriod = stub }) => {
  const msg = handleMsg({
    singular: 'scheduler.year',
    plural: 'scheduler.years'
  }, duration?.period, intl);

  const { months } = repeat?.yearly || {};

  if (months) {
    const _every = t(intl, 'scheduler.separator.every');
    const _the = t(intl, 'scheduler.separator.the');
    const _of = t(intl, 'scheduler.separator.of');

    const _months = handleMultipleDurations(intl, months);
    const _weekDays = handleMultipleDurations(intl, repeat?.weekly?.days);

    let explanation = duration?.period > 1 ? ` ${_of} ${_every} ${msg}` : '';

    if (repeat?.monthly?.type === 'Period') {
      explanation = `${_the} ${repeat?.monthly?.weekDay} ${_weekDays} ${_of} ${_every} ${_months}` + explanation;
    } else {
      explanation = `${_every} ${_months} ${repeat?.monthly?.monthDay}` + explanation;
    }

    setPeriod(explanation);
  }
};