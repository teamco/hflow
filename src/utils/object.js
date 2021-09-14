import React from 'react';
import { Select } from 'antd';
import { sortBy } from 'utils/array';

const { Option } = Select;

/**
 * @export
 * @function
 * @param {Object} values
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
export function findObjectValue(values, keys, nsDeep) {
  if (!values) {
    return values;
  }
  values = values[keys[nsDeep]];
  if (nsDeep < keys.length - 1) {
    nsDeep += 1;
    return findObjectValue(values, keys, nsDeep);
  } else {
    return values;
  }
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