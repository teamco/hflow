import React from 'react';
import { SaveOutlined } from '@ant-design/icons';
import { Button, Form, Modal } from 'antd';
import { useIntl } from 'umi';
import styles from '@/components/Authentication/authentication.module.less';

import { emailPartial } from '@/components/partials/email.partial';
import { isLoading } from '@/utils/state';

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const UpdateEmailModal = props => {
  const intl = useIntl();
  const {
    isNAEmailVisible,
    handleNAEmailCancel,
    handleNAEmailOk,
    loading
  } = props;
  return (
      <Modal title={intl.formatMessage({id: 'auth.updateEmail', defaultMessage: 'Update Email'})}
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
                {intl.formatMessage({id: 'actions.update', defaultMessage: 'Update'})}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
  );
};

export default UpdateEmailModal;
