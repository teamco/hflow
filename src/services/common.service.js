/**
 * Generate and translate standard UUIDs into shorter - or just different - formats and back.
 * @link https://github.com/oculus42/short-uuid
 */
import short from 'short-uuid';

/**
 * @constant
 * @export
 * @return {boolean}
 */
export const isDevelopment = () => process.env.NODE_ENV === 'development';

/**
 * @constant
 * @export
 * @return {boolean}
 */
export const isProduction = () => process.env.NODE_ENV === 'production';

/**
 * @export
 * @return {string}
 */
export function generateKey() {

  /**
   * Generate short uuid as a key
   * Only in case of new
   */
  return short.generate();
}

/**
 * @export
 * @param entityForm
 * @param key
 * @param [namespace]
 * @return {number}
 */
export function getEntityFormIdx({ entityForm, key, namespace = '' }) {
  let idx = -1;
  if (namespace && namespace.length) {
    key = `${namespace}/${key}`;
  }
  entityForm.forEach((form, index) => {
    if (form.name === key) {
      idx = index;
    }
  });

  return idx;
}

/**
 * @export
 * @param {string} id
 * @return {boolean}
 */
export const isNew = id => id === 'new';

/**
 * @export
 * @param type
 * @return {string}
 */
export const custDiscountType = type => type === '%' ? 'Percent' : 'Currency';
