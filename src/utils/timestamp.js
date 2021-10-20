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
 * @param {number|string} ts
 * @return {string}
 */
export const tsLocaleDateTime = date => {
  const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
  return `${day} ${month} ${year}`;
};

