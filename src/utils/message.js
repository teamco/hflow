import { message } from 'antd';
import { useIntl } from 'umi';

/**
 * @export
 * @constant
 * @type {*}
 */
export const STATUS = {
  sent: useIntl().formatMessage({id: 'status.sent', defaultMessage: 'Sent'}),
  read: useIntl().formatMessage({id: 'status.read', defaultMessage: 'Read'}),
  answered: useIntl().formatMessage({id: 'status.answered', defaultMessage: 'Answered'}),
  pending: useIntl().formatMessage({id: 'status.pending', defaultMessage: 'Pending'}),
  success: useIntl().formatMessage({id: 'status.success', defaultMessage: 'Success'}),
  failed: useIntl().formatMessage({id: 'status.failed', defaultMessage: 'Failed'}),
  inProgress: useIntl().formatMessage({id: 'status.inProgress', defaultMessage: 'In Progress'}),
  warning: useIntl().formatMessage({id: 'status.warning', defaultMessage: 'Warning'})
};

/**
 * @export
 * @param isEdit
 * @param instance
 */
export const successSaveMsg = (isEdit, instance = i18n.t('form:entity')) => {
  message.success(useIntl().formatMessage({id: isEdit ? 'msg:successUpdate' : 'msg:successSave', defaultMessage: isEdit ? '{instance} successfully updated' : '{instance} successfully created'}, { instance })).then();
};

/**
 * @export
 * @param isEdit
 * @param instance
 */
export const errorSaveMsg = (isEdit, instance) => {
  message.error(useIntl().formatMessage({id: isEdit ? 'msg:errorUpdate' : 'msg:errorSave', defaultMessage: isEdit ? 'Failed to update {instance}' : 'Failed to create {instance}'}, { instance })).then();
};

/**
 * @export
 * @param instance
 */
export const errorGetMsg = (instance) => {
  message.error(useIntl().formatMessage({id: 'msg:errorGet', defaultMessage: 'Failed to get {instance}'}, { instance })).then();
};

/**
 * @export
 * @param instance
 */
export const errorDownloadMsg = (instance) => {
  message.error(useIntl().formatMessage({id: 'msg:errorDownload', defaultMessage: 'Failed to download file: {instance}'}, { instance })).then();
};

/**
 * @export
 * @param instance
 */
export const successDeleteMsg = (instance) => {
  message.success(useIntl().formatMessage({id: 'msg:successDelete', defaultMessage: '{instance} successfully deleted'}, { instance })).then();
};

/**
 * @export
 * @param instance
 */
export const errorDeleteMsg = (instance) => {
  message.error(useIntl().formatMessage({id: 'msg:errorDelete',defaultMessage: 'Failed to delete {instance}'}, { instance })).then();
};
