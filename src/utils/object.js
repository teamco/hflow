import React from 'react';
import { Select } from 'antd';
import { sortBy } from 'utils/array';

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
  if (!object) {
    return object;
  }
  object = object[keys[nsDeep]];
  if (nsDeep < keys.length - 1) {
    nsDeep += 1;
    return findObjectValue(object, keys, nsDeep);
  } else {
    return object;
  }
}

/**
 * @export
 * @param object
 * @param {string} key
 * @return {null|*}
 */
export function findObjectByKey(object, key) {
  let result = null;
  if (Array.isArray(object)) {
    for (let i = 0; i < object.length; i++) {
      result = findObjectByKey(object[i], key);
      if (result) {
        break;
      }
    }
  } else {
    for (let prop in object) {
      if (prop === key) {
        return object[prop];
      }
      if (object[prop] instanceof Object || Array.isArray(object[prop])) {
        result = findObjectByKey(object[prop], key);
        if (result) {
          break;
        }
      }
    }
  }

  if (!result) {
    throw new Error(`Undefined ${key}`);
  }

  return result;
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
