/**
 * @export
 * @param list
 * @param {string} value
 * @param [t]
 * @return {*}
 */
export const sortBy = (list = [], value, t = false) => {

  /**
   * @private
   * @param object
   * @param value
   * @return {*}
   */
  const _complexValue = (object, value) => {
    const matchers = value.split(/\./);
    let _value;
    if (matchers.length > 1) {
      matchers.forEach(cv => {
        _value = _value ? _value[cv] : object[cv];
      });
    }

    return t ? t(_value) : _value;
  };

  return [...list].sort((a, b) => {
    const _a = _complexValue(a, value);
    const _b = _complexValue(b, value);
    return (_a > _b) ? 1 : (_a < _b) ? -1 : 0;
  });
};

/**
 * @export
 * @param list
 * @param value
 * @return {*}
 */
export const sortByDate = (list = [], value) => {
  return [...list].sort((a, b) => {
    const keyA = new Date(a[value]),
        keyB = new Date(b[value]);
    return (keyA < keyB) ? -1 : (keyA > keyB) ? 1 : 0;
  });
};
