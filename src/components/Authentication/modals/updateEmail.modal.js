import React from 'react';
import { SaveOutlined } from '@ant-design/icons';
import { Button, Form, Modal } from 'antd';

import styles from 'components/Authentication/authentication.module.less';

import { emailPartial } from 'components/partials/email.partial';
import { isLoading } from 'utils/state';

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const UpdateEmailModal = props => {
  const {
    t,
    isNAEmailVisible,
    handleNAEmailCancel,
    handleNAEmailOk,
    loading
  } = props;
  return (
      <Modal title={t('auth:updateEmail')}
             visible={isNAEmailVisible}
             footer={null}
             closable={false}>
        <Form name={'auth_login_na_email'}
              className={styles.loginForm}
              size={'large'}
              onFinish={handleNAEmailOk}>
          {emailPartial({ t, name: 'na_email', className: styles.updateEmail })}
          <Form.Item className={styles.updateEmail}>
            <div className={styles.updateEmailBtns}>
              <Button type={'primary'}
                      htmlType={'submit'}
                      icon={<SaveOutlined/>}
                      size={'default'}
                      loading={isLoading(loading)}>
                {t('actions:update')}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
  );
};

export default UpdateEmailModal;
