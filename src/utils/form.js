import { findObjectByKey } from '@/utils/object';

/**
 * @export
 * @param {string} namespace
 * @param {Object} wrapper
 * @param {boolean} [condition]
 * @return {*|null}
 */
export function complexFormKey(namespace, wrapper = {}, condition = false) {
  let entity;
  if (condition) {
    // Handle namespaced case.
    entity = { ...wrapper };
  } else if (wrapper[namespace]) {
    // Handle inheritance case.
    entity = wrapper[namespace];
  } else {
    // Handle complex case.
    entity = findObjectByKey(namespace, wrapper);
  }
  return entity;
}

/**
 * @export
 * @param fields
 * @param {string} namespace
 * @param {Array} prefix
 * @param {boolean} [condition]
 * @return {*|{}}
 */
export const scanByPrefix = (fields, namespace, prefix = [], condition = false) => {
  let _fields = {...fields};
  prefix.forEach(n => {
    _fields = fields[n] || {};
  });

  return complexFormKey(namespace, _fields, condition) || {};
};

/**
 * @export
 * @param formRef
 * @param {array} prefix
 * @param {string} namespace
 * @param value
 */
export function updateComplexForm(formRef, prefix, namespace, value) {
  const field = {};
  let result = null;

  /**
   * @constant
   * @param {Array} prefix
   * @param {Object} field
   * @param value
   * @param {number} [idx]
   * @return {*}
   * @private
   * @example
   * prefix = ['a','b','c'];
   * namespace = 'discount';
   * value = {type:'%', value: 10};
   * => {a: {b: {c: {discount: {type:'%', value: 10}}}}}
   */
  const _recursive = function(prefix, field, value, idx = 0) {
    if (idx >= prefix.length) {
      // Set value
      field[namespace] = value;
      return;
    }

    field[prefix[idx]] = {};
    const _res = _recursive(prefix, field[prefix[idx]], value, idx + 1);
    result = field;
    return _res;
  };

  _recursive(prefix, field, value);
  formRef.setFieldsValue(result);
}
