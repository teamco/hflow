import { handleMsg } from '@/components/Scheduler/handlers';
import { t } from '@/utils/i18n';

/**
 * @export
 * @param duration
 * @param intl
 * @param formRef
 * @return {`${*} ${string}`}
 */
export const dayHandler = (duration, { intl }) => {
  const _every = t(intl, 'scheduler.separator.every');

  return `${_every} ${handleMsg({
    singular: 'scheduler.day',
    plural: 'scheduler.days'
  }, duration?.period, intl)}`;
};