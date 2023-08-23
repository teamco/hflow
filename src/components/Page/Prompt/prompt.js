import React from 'react';
import { useIntl } from '@umijs/max';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import { useUnload } from '@/utils/hooks';
import { t } from '@/utils/i18n';

import ConfirmContextProvider from '@/components/Page/Prompt/lib/ConfirmContext';
import { ReactRouterPrompt } from '@/components/Page/Prompt/lib/ReactRouterPrompt';

import styles from './prompt.module.less';

/**
 * @export
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export const PagePrompt = props => {
  const intl = useIntl();

  const { touched } = props;

  // Handle browser refresh
  useUnload(e => {
    e.preventDefault();
    e.stopImmediatePropagation();
    e.returnValue = '';
  }, touched);

  return touched ? (
      <ConfirmContextProvider>
        <ReactRouterPrompt when={touched}>
          {({ isActive, onConfirm, onCancel }) => (
              <Modal title={(
                  <div className={styles.title}>
                    <ExclamationCircleOutlined/>
                    <h1>{t(intl, 'msg.unsavedData')}</h1>
                  </div>
              )}
                     className={styles.confirmation}
                     open={isActive}
                     onOk={onConfirm}
                     onCancel={onCancel}
                     okText={t(intl, 'actions.ok')}
                     cancelText={t(intl, 'actions.cancel')}>
                <p>
                  {t(intl, 'msg.unsaved')}
                </p>
              </Modal>
          )}
        </ReactRouterPrompt>
      </ConfirmContextProvider>
  ) : null;
};

