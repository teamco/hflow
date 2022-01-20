/**
 * @export
 * @param timestamp
 * @return {string}
 */
export const localeDateTimeString = (timestamp) => {
  const _date = new Date(timestamp);
  return `${_date.toLocaleDateString()} ${_date.toLocaleTimeString()}`;
};

/**
 * @export
 * @param loading
 * @return {*}
 */
export const spinningAll = (loading) => {
  const spinAt = Object.keys(loading.effects).filter((key) => loading.effects[key]);
  return !!spinAt.length;
};

/**
 * @export
 * @param loading
 * @return {boolean}
 */
export const spinningGlobal = (loading) => {
  const _globals = Object.keys(loading.effects).filter((key) => key.match(/appModel/));
  const spinAt = _globals.filter((key) => loading.effects[key]).length;
  return !!spinAt.length;
};

/**
 * @export
 * @param loading
 * @return {boolean}
 */
export const spinningLocal = (loading) => {
  const _locals = Object.keys(loading.effects).filter((key) => !key.match(/appModel/));
  const spinAt = _locals.filter((key) => loading.effects[key]);
  return !!spinAt.length;
};

/**
 * Fix the 'Received "true" for a non-boolean attribute.
 * @export
 * @param {boolean} loading
 * @return {number}
 */
export const isLoading = loading => {
  return loading ? 1 : 0;
};
