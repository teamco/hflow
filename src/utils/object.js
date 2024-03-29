import React from 'react';
import { Select } from 'antd';
import { sortBy } from '@/utils/array';
import _ from 'lodash';

const { Option } = Select;

/**
 * @export
 * @function
 * @param {Object} object
 * @param {[string]} keys
 * @param {number} nsDeep Start from index.
 * @example
 * const values = {
 *    phone: {
 *      area: 780,
 *      code: "+1",
 *      number: "56785"
 *    }
 * };
 * const keys = 'phone.number'.split('.');
 * const value = findObjectValue(values, keys, 0)
 * @return {*}
 */
export function findObjectValue(object, keys, nsDeep) {
  if (!object) return null;

  const _object = object[keys[nsDeep]];
  if (nsDeep < keys.length - 1) {
    return findObjectValue(_object, keys, nsDeep + 1);
  } else {
    return _object;
  }
}

/**
 * @export
 * @param object
 * @param {string} key
 * @return {null|*}
 */
export function findObjectByKey(key, object = {}) {

  /**
   * @constant
   * @param obj
   * @param {string} key
   * @param {array} res
   * @return {any|*[]}
   */
  const findValuesDeepByKey = (obj, key, res = []) => (
      _.cloneDeepWith(obj, (v, k) => {
        k === key && res.push(v);
      }) && res
  );

  const result = findValuesDeepByKey(object, key);

  // if (!result.length) {
  //   throw new Error(`Undefined ${key}`);
  // }

  return result[0];
}

/**
 * @export
 * @param entityForm
 * @param key
 * @return {*}
 */
export const fromForm = (entityForm, key) => {
  return (entityForm.find(form => form.name === key) || {}).value;
};

/**
 * @export
 * @param entity
 * @param [defaultValue]
 * @return {null|*}
 */
export const setAs = (entity, defaultValue = null) => {
  return typeof entity === 'undefined' ? defaultValue : entity;
};

/**
 * @export
 * @param {array} [tags]
 * @param {boolean} [disabled]
 * @return {*}
 */
export const toTags = (tags = [], disabled = false) => {
  return tags.map(tag => ({ name: tag, disabled }));
};

/**
 * @export
 * @param {array} tags
 * @param {string} [key]
 * @return {*}
 */
export const asSortedTags = (tags = [], key = 'name') => {
  return sortBy(tags, key).map((tag, idx) => (
      <Option key={idx}
              disabled={tag.disabled}
              value={tag.name}>
        {tag.name}
      </Option>
  ));
};

/**
 * @export
 * @param obj1
 * @param obj2
 * @returns {boolean}
 */
export const isDiff = (obj1, obj2) => {
  return JSON.stringify(obj1 || obj2) !== JSON.stringify(obj2);
}