/**
 * @export
 * @param {number} price
 * @param {string} [locales]
 * @param {string} [style]
 * @param {string} [currency]
 * @return {string}
 */
export const currencyFormat = ({ price, locales = 'en-US', style = 'currency', currency = 'USD' }) => {
  return new Intl.NumberFormat(locales, { style, currency }).format(price);
};
