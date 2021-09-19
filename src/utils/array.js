/**
 * @export
 * @param list
 * @param {string} value
 * @return {*}
 */
export const sortBy = (list = [], value) => {
  return [...list].sort((a, b) => (a[value] > b[value]) ? 1 : (a[value] < b[value]) ? -1 : 0);
};

/**
 * @export
 * @param list
 * @param value
 * @return {*}
 */
export const sortByDate = (list, value) => {
  return list.sort((a, b) => {
    const keyA = new Date(a[value]),
      keyB = new Date(b[value]);
    return (keyA < keyB) ? -1 : (keyA > keyB) ? 1 : 0;
  });
};
