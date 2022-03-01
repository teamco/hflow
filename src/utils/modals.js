import React from 'react';
import { Modal } from 'antd';
import { useIntl } from 'umi';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

/**
 * @constant
 * @param type
 * @param buttons
 * @param rest
 * @return {Promise<unknown>}
 */
export const showModal = ({ type, buttons = {}, ...rest }) => {
  const DEFAULT_OK = useIntl().formatMessage({id: 'actions.ok', defaultMessage: 'Ok'});
  const DEFAULT_CANCEL = useIntl().formatMessage({id: 'actions.cancel', defaultMessage: 'Cancel'});

  return new Promise((resolve) => {
    Modal[type]({
      okText: buttons.okText || DEFAULT_OK,
      cancelText: buttons.okText || DEFAULT_CANCEL,
      ...rest,
      onOk: () => resolve(true),
      onCancel: () => resolve(false)
    });
  });
};

/**
 * @export
 * @param onOk
 * @param [okText]
 * @param [okType]
 */
export function showConfirm(onOk, okText = i18n.t('actions:ok'), okType = 'primary') {
  confirm({
    title: useIntl().formatMessage({id: 'actions.delete', defaultMessage: 'Delete'}),
    icon: <QuestionCircleOutlined/>,
    content: useIntl().formatMessage({id: 'msg:deleteConfirm', defaultMessage: 'Are you sure to delete this {instance}?'}, { instance: '$t(instance:website)' }),
    onOk,
    okText,
    okType
  });
}
