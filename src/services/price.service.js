import dayjs from 'dayjs';

import { DEFAULT_DATE_FORMAT } from '@/utils/timestamp';
import { custDiscountType } from '@/services/common.service';
import { stub } from '@/utils/function';

/**
 * @export
 * @param price
 * @param format
 * @returns {{discount: ({duration, startedAt: (string), type: string}|null)}}
 * @private
 */
export const definePrice = (price = {}, format = true) => {
  const { discount = {}, discounted } = price;
  const _formattedDate = format ? `${dayjs(discount?.startedAt).format(DEFAULT_DATE_FORMAT)} 00:00:00` :
      dayjs(discount?.startedAt);
  const startedAt = discount?.startedAt ? _formattedDate : null;

  return {
    ...price,
    discount: discounted ? {
      ...discount,
      startedAt,
      type: custDiscountType(discount?.type),
      duration: { ...discount?.duration }
    } : null
  };
};

/**
 * @export
 * @param trialed
 * @param trialPeriod
 * @param format
 * @returns {{price: {discount: ({duration, startedAt: (string), type: string}|null)}}|null}
 * @private
 */
export const defineTrialed = (trialed, trialPeriod = {}, format = true) => {
  return trialed ? {
    ...trialPeriod,
    price: { ...definePrice(trialPeriod?.price, format) }
  } : null;
};

/**
 * @function
 * @param startedAt
 * @param {number} duration
 * @param {string} type
 * @returns {boolean}
 * @private
 */
function _dateInRange(startedAt, duration, type) {
  const d = new Date(startedAt);
  let year = d.getFullYear();
  let month = d.getMonth();
  let day = d.getDate();
  let time = d.getTime();
  const cts = +(new Date);

  switch (type) {
    case 'Hour':
      time += (duration * 60 * 60 * 1000);
      break;
    case 'Day':
      day += duration;
      break;
    case 'Week':
      day += (duration * 7);
      break;
    case 'Month':
      month += duration;
      break;
    case 'Year':
      year += duration;
      break;
    case 'Permanent':
      return cts > +d;
  }

  const expiredAt = new Date(year, month, day);

  return expiredAt.setHours(time) >= cts && cts > +d;
}

/**
 * @export
 * @param {object} [refs]
 * @param {array} [features]
 * @param {function} [setter]
 */
export const handleExpectedFeaturesPrice = ({ refs = {}, features = [], setter = stub }) => {
  const _enabledFeaturesPrice = Object.entries(refs).
      filter(f => f[1]).
      map(ef => features.find(f => f.id === ef[0]).price);

  let _expectedPrice = 0;
  _enabledFeaturesPrice.forEach(price => {
    _expectedPrice += price.originalPrice;
  });

  setter(_expectedPrice);
};
