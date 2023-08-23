import React from 'react';
import { SaveOutlined } from '@ant-design/icons';
import { Button, Form, Modal } from 'antd';
import { useIntl } from '@umijs/max';
import styles from '@/components/Authentication/authentication.module.less';

import { EmailPartial } from '@/components/partials/email.partial';
import { isLoading } from '@/utils/state';
import { t } from '@/utils/i18n';

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
      <Modal title={t(intl, 'auth.updateEmail',)}
             open={isNAEmailVisible}
             footer={null}
             closable={false}>
        <Form name={'auth_login_na_email'}
              className={styles.loginForm}
              size={'large'}
              onFinish={handleNAEmailOk}>
          <EmailPartial name={'na_email'} className={styles.updateEmail}/>
          <Form.Item className={styles.updateEmail}>
            <div className={styles.updateEmailBtns}>
              <Button type={'primary'}
                      htmlType={'submit'}
                      icon={<SaveOutlined/>}
                      size={'default'}
                      loading={isLoading(loading)}>
                {t(intl, 'actions.update')}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
  );
};

export default UpdateEmailModal;
