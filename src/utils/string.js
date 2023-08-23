/**
 * @export
 * @description Changes camel case to a human-readable format.
 * So helloWorld, hello-world and hello_world becomes "Hello World".
 * @param str
 * @return {string}
 */
export function prettifyCamelCase(str) {
  let output = '';
  const len = str.length;
  let char;

  for (let i = 0; i < len; i++) {
    char = str.charAt(i);

    if (!i) {
      output += char.toUpperCase();
    } else if (char !== char.toLowerCase() && char === char.toUpperCase()) {
      output += ' ' + char;
    } else if (char === '-' || char === '_') {
      output += ' ';
    } else {
      output += char;
    }
  }

  return output;
}

/**
 * @export
 * @param {number} price
 * @param {string} language
 * @param {{currency, style}} opts
 * @return {string}
 */
export const toPrice = (price, language, opts = {}) => {
  return price.toLocaleString(language, { ...{ currency: 'USD', style: 'currency' }, ...opts });
};

export const toNumber = (number, language) => {
  return number.toLocaleString(language);
};

/**
 * @export
 * @param {string} name
 * @returns {string}
 */
export const normalize = (name = '') => name.toLowerCase().replace(/ /g, '_');