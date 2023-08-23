import dayjs from 'dayjs';

import { xhrRequest } from '@/services/authentication.service';

import request from '@/utils/request';
import { dateTimeFormat } from '@/utils/timestamp';

const { API } = require('@/services/config/api.config');

/**
 * @export
 * @param schedulers
 * @return {*[]}
 */
export const mapSchedulerByRefs = ({ schedulers = [] }) => [...schedulers.map(scheduler => scheduler.id)];

/**
 * @export
 * @param schedulers
 * @return {(*)[]}
 */
export const adaptToSaveSchedulerDates = schedulers => [...schedulers].map(scheduler => {
  return {
    ...scheduler,
    range: {
      ...scheduler.range,
      startedAt: dateTimeFormat(scheduler.range.startedAt),
      endReason: {
        ...scheduler.range.endReason,
        expiredAt: scheduler.range.endReason.type === 'Date' ?
            dateTimeFormat(scheduler.range.startedAt) : null
      }
    }
  };
});

/**
 * @export
 * @param schedulers
 * @return {(*)[]}
 */
export const adaptToFormSchedulerDates = schedulers => [...schedulers].map(scheduler => {
  return {
    ...scheduler,
    range: {
      ...scheduler.range,
      startedAt: dayjs(scheduler.range.startedAt),
      endReason: {
        ...scheduler.range.endReason,
        expiredAt: scheduler.range.endReason.type === 'Date' ?
            dayjs(scheduler.range.startedAt) : null
      }
    }
  };
});

/**
 * @export
 * @param {number} size
 * @param {number} page
 * @param {string} token
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const getAllSchedulers = ({ size, page, token }) => {
  return xhrRequest({
    url: API.schedulers.store,
    method: request.METHOD.get,
    params: { size, page },
    token
  });
};

/**
 * @export
 * @param schedulersOf
 * @param token
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const getSchedulersOf = ({ schedulersOf = {}, token }) => {
  const { apiOf, keyOf, id } = schedulersOf;

  return xhrRequest({
    url: `${apiOf}/schedulers`,
    method: request.METHOD.get,
    [keyOf]: id,
    token
  });
};

/**
 * @async
 * @export
 * @param {Array} data
 * @param {string} token
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const createSchedulers = async ({ data, token }) => {
  return xhrRequest({ url: API.schedulers.store, data, token });
};

/**
 * @export
 * @async
 * @param {Array} data
 * @param {string} token
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const updateSchedulers = async ({ data, token }) => {
  return xhrRequest({
    url: API.schedulers.store,
    method: request.METHOD.put,
    data,
    token
  });
};




