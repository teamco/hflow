import { findObjectByKey } from '@/utils/object';

/**
 * @export
 * @param {Object} wrapper
 * @param {string} namespace
 * @param {boolean} [condition]
 * @return {*|null}
 */
export function complexFormKey(wrapper, namespace, condition = false) {
  let entity;
  if (condition) {
    // Handle namespaced case.
    entity = { ...wrapper };
  } else if (wrapper[namespace]) {
    // Handle inheritance case.
    entity = wrapper[namespace];
  } else {
    // Handle complex case.
    entity = findObjectByKey(wrapper, namespace);
  }
  return entity;
}

export function updateComplexForm(formRef, prefix = [], namespace, value) {
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
  const _recursive = function (prefix = [], field, value, idx = 0) {
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
