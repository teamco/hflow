/**
 * Generate and translate standard UUIDs into shorter - or just different - formats and back.
 * @link https://github.com/oculus42/short-uuid
 */
import short from 'short-uuid';

import capitalize from 'capitalize-first-letter';
import dayjs from 'dayjs';
import { getDvaApp } from '@umijs/max';

import { stub } from '@/utils/function';
import { networkError, successSaveMsg } from '@/utils/message';
import {
  DEFAULT_DATE_FORMAT,
  DEFAULT_DATE_TIME_FORMAT
} from '@/utils/timestamp';

/**
 * @constant
 * @export
 * @return {boolean}
 */
export const isDevelopment = () => process.env.NODE_ENV === 'development';

/**
 * @constant
 * @export
 * @return {boolean}
 */
export const isProduction = () => process.env.NODE_ENV === 'production';

/**
 * @export
 * @return {string}
 */
export function generateKey() {

  /**
   * Generate short uuid as a key
   * Only in case of new
   */
  return short.generate();
}

/**
 * @export
 * @param changedFields
 * @param allFields
 * @param MODEL_NAME
 * @param [dispatch]
 */
export const onFieldsChangeHandler = ({ changedFields, allFields, MODEL_NAME, dispatch = stub }) => {
  dispatch({
    type: `${MODEL_NAME}/updateFields`,
    payload: {
      changedFields,
      allFields,
      model: MODEL_NAME
    }
  });
};

/**
 * @export
 * @param entityForm
 * @param key
 * @param [namespace]
 * @return {number}
 */
export function getEntityFormIdx({ entityForm, key, namespace = '' }) {
  let idx = -1,
      _key = key;
  if (namespace && namespace.length) {
    _key = `${namespace}/${key}`;
  }
  entityForm.forEach((form, index) => {
    if (form.name === _key) {
      idx = index;
    }
  });

  return idx;
}

/**
 * @export
 * @param props
 * @return {*[]}
 */
export const toEntityForm = (props) => {
  const {
    entityForm = [],
    formObj = {},
    dateFields = [],
    dateTimeFields = []
  } = props;

  const _entityForm = [...entityForm];
  const toDelete = [];

  const keys = Object.keys(formObj);

  for (const element of keys) {
    const key = element;
    const idx = getEntityFormIdx({ entityForm, key });

    const isDate = dateFields.find(d => d === key);
    const isDateTime = dateTimeFields.find(d => d === key);

    let value = formObj[key];

    if (isDate) {
      value = dayjs(dayjs(formObj[key]).format(DEFAULT_DATE_FORMAT));
    }

    if (isDateTime) {
      value = dayjs(dayjs(formObj[key]).format(DEFAULT_DATE_TIME_FORMAT));
    }

    const formItem = { name: key, value };

    // Overwrite existing values
    if (idx > -1) {
      toDelete.push(idx);
    }

    _entityForm.push(formItem);
  }

  return [..._entityForm.filter((_form, idx) => toDelete.indexOf(idx) === -1)];
};

/**
 * @export
 * @param {string} id
 * @param {boolean} [isMatch]
 * @return {boolean}
 */
export const isNew = (id, isMatch = false) => isMatch ? id.match(/\/new/) : id === 'new';

/**
 * @export
 * @param {string} [path]
 * @returns {boolean}
 */
export const isHomePage = (path = '') => path === '/';

/**
 * @export
 * @param {string} [path]
 * @returns {boolean}
 */
export const isAdminPage = (path = '') => !!path.match(/^\/admin/);

/**
 * @export
 * @param {string} [path]
 * @returns {boolean}
 */
export const isLoginPage = (path = '') => path === '/login';

/**
 * @export
 * @param {string} [path]
 * @returns {boolean}
 */
export const isLogoutPage = (path = '') => !!path.match(/^\/logout/);

/**
 * @export
 * @param {string} [path]
 * @returns {boolean}
 */
export const isProfilePage = (path = '') => path === '/profile';

/**
 * @export
 * @param type
 * @return {string}
 */
export const custDiscountType = type => type === '%' ? 'Percent' : 'Currency';

/**
 * @export
 * @async
 * @param {string} collectionPath
 * @param {boolean} [notice]
 * @param {string} [action]
 * @example
 * networkConnection('users', true, 'add')
 * @return {Promise<boolean>}
 */
export const networkConnection = async (collectionPath, notice = true, action = 'firestore') => {
  if (window.navigator.onLine) {
    return true;
  }

  if (notice) {
    await networkError();
    await successSaveMsg(false, capitalize(collectionPath));
  }

  console.error(`No network connection on ${action}: ${collectionPath}\n`);
  return false;
};

/**
 * @export
 * @return {*}
 */
export const useDispatcher = () => {
  const dva = getDvaApp();
  return dva._store.dispatch;
};
