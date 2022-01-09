import moment from 'moment';

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
 * @export
 * @param {number|string} ts
 * @return {string}
 */
export const tsToDate = ts => {
  ts = parseInt(ts, 10);
  return (new Date(ts)).toLocaleDateString();
};

/**
 * @export
 * @param {number|string} ts
 * @return {string}
 */
export const tsToTime = ts => {
  ts = parseInt(ts, 10);
  return (new Date(ts)).toLocaleTimeString();
};

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
  return `${moment(date).format(DEFAULT_DATE_FORMAT)} 00:00:00`
}
