import request from '@/utils/request';
import { intl } from '@/utils/i18n';

/**
 * @export
 * @async
 * @param isEdit
 * @param instance
 */
export const successSaveMsg = async (isEdit, instance = 'Entity') => {
  const { messageApi } = request.xhr.notification;

  const msg = await intl({
    id: isEdit ? 'msg.successUpdate' : 'msg.successSave',
    defaultMessage: isEdit ?
        `${instance} successfully updated` :
        `${instance} successfully created`,
    instance
  });

  messageApi.success(msg);
};

/**
 * @export
 * @param isEdit
 * @param instance
 */
export const errorSaveMsg = async (isEdit, instance) => {
  const { messageApi } = request.xhr.notification;

  const msg = await intl({
    id: isEdit ? 'msg.errorUpdate' : 'msg.errorSave',
    defaultMessage: isEdit ?
        `Failed to update ${instance}` :
        `Failed to create ${instance}`,
    instance
  });

  messageApi.error(msg);
};

/**
 * @export
 * @param instance
 */
export const errorGetMsg = async (instance) => {
  const { messageApi } = request.xhr.notification;

  const msg = await intl({
    id: 'msg.errorGet',
    defaultMessage: `Failed to get ${instance}`,
    instance
  });

  messageApi.error(msg);
};

/**
 * @export
 * @param intl
 * @param instance
 */
export const errorDownloadMsg = async (intl, instance) => {
  const { messageApi } = request.xhr.notification;

  const msg = intl({
    id: 'msg.errorDownload',
    defaultMessage: `Failed to download file: ${instance}`,
    instance
  });

  messageApi.error(msg);
};

/**
 * @export
 * @param instance
 */
export const successDeleteMsg = async (instance = 'Entity') => {
  const { messageApi } = request.xhr.notification;

  const msg = await intl({
    id: 'msg.successDelete',
    defaultMessage: `${instance} successfully deleted`,
    instance
  });

  messageApi.success(msg);
};

/**
 * @export
 * @param instance
 */
export const errorDeleteMsg = async (instance) => {
  const { messageApi } = request.xhr.notification;

  const msg = await intl({
    id: 'msg.errorDelete',
    defaultMessage: `Failed to delete ${instance}`,
    instance
  });

  messageApi.error(msg);
};

/**
 * @export
 * @return {Promise<void>}
 */
export const networkError = async () => {
  const { messageApi } = request.xhr.notification;

  const msg = await intl({
    id: 'error.noConnection',
    defaultMessage: 'No internet connection'
  });

  messageApi.error(msg);
};

/**
 * @export
 * @return {Promise<void>}
 */
export const successSentVerificationEmail = async () => {
  const { messageApi } = request.xhr.notification;

  const msg = await intl({
    id: 'msg.successSentVerificationEmail',
    defaultMessage: 'Email verification has been sent'
  });

  messageApi.success(msg);
};

/**
 * @export
 * @return {Promise<void>}
 */
export const pendingEmailVerification = async () => {
  const { messageApi } = request.xhr.notification;

  const msg = await intl({
    id: 'msg.pendingEmailVerification',
    defaultMessage: 'Pending Email verification'
  });

  messageApi.warning(msg);
};

/**
 * @export
 * @return {Promise<void>}
 */
export const errorSentVerificationEmail = async () => {
  const { messageApi } = request.xhr.notification;

  const msg = await intl({
    id: 'msg.errorSentVerificationEmail',
    defaultMessage: 'Failed to send Email verification'
  });

  messageApi.error(msg);
};
