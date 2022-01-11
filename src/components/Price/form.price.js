/**
 * @export
 * @param {string} currency
 * @param {boolean} [discounted]
 * @return {{price: {discounted: boolean, originalPrice: number, discount: {duration: {period: number, type: string},
 *     value: number}, currency}}}
 * @constructor
 */
export const DEFAULT_PRICE_VALUES = (currency, discounted = true) => ({
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
    }
  }
});
