/**
 * @export
 * @param {string} currency
 * @param {boolean} [discounted]
 * @param [overwrite]
 * @return {{price: {discounted: boolean, originalPrice: number, discount: {}, currency: string}}}
 * @constructor
 */
export const DEFAULT_PRICE_VALUES = (currency, discounted = true, overwrite = {}) => ({
  price: {
    originalPrice: 1,
    discounted,
    currency,
    discount: {
      value: 1,
      duration: {
        period: 1,
        type: 'Month'
      }
    },
    ...overwrite
  }
});
