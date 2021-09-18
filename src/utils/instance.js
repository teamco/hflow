/**
 * @export
 * @param instance
 * @param defaultValue
 * @param [fallbackValue]
 * @return {*}
 */
export const defineInstance = (instance, defaultValue, fallbackValue = null) => {
  instance = instance || defaultValue || fallbackValue;
  return instance;
};
