/**
 * @export
 * @param currency
 * @return {{price: {discounted: boolean, originalPrice: number, discount: {duration: {period: number, type: string}, value: number}, currency}}}
 * @constructor
 */
export const DEFAULT_PRICE_VALUES = (currency) => ({
  price: {
    originalPrice: 1,
    discounted: true,
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
