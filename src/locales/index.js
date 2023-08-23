import * as enUs from './en-US';

/**
 * @export
 * @param {string} key
 * @param {string} suffix
 * @return {string}
 */
export const adaptTranslations = (key, suffix) => {
  let msg = key.toLowerCase();
  return key.match(new RegExp(suffix)) ? msg : `${suffix}.${msg}`;
}

/**
 * @export
 * @type {Object}
 */
export const locales = {
  'en-US': enUs.default
};
