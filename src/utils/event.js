/**
 * @export
 * @param {string} type
 * @param [props]
 * @return {*}
 */
export const createEvent = (type, props = {}) => {
  return new Event(type, { ...props });
};