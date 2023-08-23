import dayjs from 'dayjs';

import { stub } from '@/utils/function';

/**
 * @export
 * @type {string}
 */
export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';

/**
 * @export
 * @type {string}
 */
export const DEFAULT_DATE_TIME_FORMAT = `${DEFAULT_DATE_FORMAT} HH:mm:ss`;

/**
 * @constant
 * @type {function(*=): dayjs.Dayjs}
 */
export const nextDayOf = (amount = 1) => dayjs().add(amount, 'day');

/**
 * @constant
 * @param ts
 * @returns {Date}
 */
const toDate = ts => {
  let _ts = ts;
  if (isNaN(new Date(_ts).getDate())) {
    _ts = parseInt(_ts, 10);
  }
  return new Date(_ts);
};

/**
 * @export
 * @param {number|string} ts
 * @return {string}
 */
export const tsToDate = ts => toDate(ts).toLocaleDateString();

/**
 * @export
 * @param {number|string} ts
 * @return {string}
 */
export const tsToTime = ts => toDate(ts).toLocaleTimeString();

/**
 * @export
 * @param {number|string} ts
 * @return {string}
 */
export const tsToLocaleDateTime = ts => {
  return `${tsToDate(ts)} ${tsToTime(ts)}`;
};

/**
 * @export
 * @param props
 */
export const delayedFn = props => {
  const { callback, ts } = props;

  const _ts = setTimeout(() => {
    callback();
    clearTimeout(_ts);
  }, ts);
};

/**
 * @export
 * @param {Date} date
 * @return {`${string} 00:00:00`}
 */
export const dateFormat = date => {
  return `${dayjs(date).format(DEFAULT_DATE_FORMAT)} 00:00:00`;
};

/**
 * @export
 * @param {Date} datetime
 * @return {string}
 */
export const dateTimeFormat = datetime => {
  return `${dayjs(datetime).format(DEFAULT_DATE_TIME_FORMAT)}`;
};

/**
 * @export
 * @param current
 * @param [unitOfTime]
 * @return {boolean}
 */
export const disabledDate = (current, unitOfTime = 'day') => current && current < dayjs().endOf(unitOfTime);

/**
 * @export
 * @param {number} duration
 * @param setter
 */
export function startTimer(duration, setter = stub) {
  let timer = duration, minutes, seconds;

  const _timer = setInterval(function() {
    minutes = Math.ceil(timer / 60);
    seconds = Math.ceil(timer % 60);

    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    setter(minutes + ':' + seconds);

    if (--timer < 0) {
      timer = duration;
      clearTimeout(_timer);
    }
  }, 1000);
}