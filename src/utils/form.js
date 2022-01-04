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
