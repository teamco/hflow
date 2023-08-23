/**
 * @export
 * @param {string} currency
 * @param {boolean} [discounted]
 * @param [overwrite]
 * @return {{price: {discounted: boolean, originalPrice: number, discount: {}, currency: string}}}
 * @constructor
 */
export const DEFAULT_PRICE_VALUES = (currency, discounted = false, overwrite = {}) => ({
  price: {
    originalPrice: 1,
    discounted,
    currency,
    paymentDuration: {
      type: 'Month',
      period: 1
    },
    discount: {
      type: '%',
      value: 1
    },
    ...overwrite
  }
});
