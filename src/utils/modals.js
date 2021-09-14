import React from 'react';
import { Modal } from 'antd';

import { QuestionCircleOutlined } from '@ant-design/icons';

import i18n from './i18n';

const { confirm } = Modal;

/**
 * @constant
 * @param type
 * @param buttons
 * @param rest
 * @return {Promise<unknown>}
 */
export const showModal = ({ type, buttons = {}, ...rest }) => {
  const DEFAULT_OK = i18n.t('actions:ok');
  const DEFAULT_CANCEL = i18n.t('actions:cancel');

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
    title: i18n.t('actions:delete'),
    icon: <QuestionCircleOutlined />,
    content: i18n.t('msg:deleteConfirm', { instance: '$t(instance:website)' }),
    onOk,
    okText,
    okType
  });
}
