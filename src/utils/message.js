import { message } from 'antd';
import i18n from './i18n';

/**
 * @export
 * @constant
 * @type {*}
 */
export const STATUS = {
  sent: i18n.t('status:sent'),
  read: i18n.t('status:read'),
  answered: i18n.t('status:answered'),
  pending: i18n.t('status:pending'),
  success: i18n.t('status:success'),
  failed: i18n.t('status:failed'),
  inProgress: i18n.t('status:inProgress'),
  warning: i18n.t('status:warning')
};

/**
 * @export
 * @param isEdit
 * @param instance
 */
export const successSaveMsg = (isEdit, instance = i18n.t('form:entity')) => {
  message.success(i18n.t(isEdit ? 'msg:successUpdate' : 'msg:successSave', { instance })).then();
};

/**
 * @export
 * @param isEdit
 * @param instance
 */
export const errorSaveMsg = (isEdit, instance) => {
  message.error(i18n.t(isEdit ? 'msg:errorUpdate' : 'msg:errorSave', { instance })).then();
};

/**
 * @export
 * @param instance
 */
export const errorGetMsg = (instance) => {
  message.error(i18n.t('msg:errorGet', { instance })).then();
};

/**
 * @export
 * @param instance
 */
export const errorDownloadMsg = (instance) => {
  message.error(i18n.t('msg:errorDownload', { instance })).then();
};

/**
 * @export
 * @param instance
 */
export const successDeleteMsg = (instance) => {
  message.success(i18n.t('msg:successDelete', { instance })).then();
};

/**
 * @export
 * @param instance
 */
export const errorDeleteMsg = (instance) => {
  message.error(i18n.t('msg:errorDelete', { instance })).then();
};
