import React from 'react';
import { Button, Col, Divider, Form, Input, Modal, Row, Tooltip } from 'antd';
import { FormOutlined, LockTwoTone, LoginOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { EmailPartial } from '@/components/partials/email.partial';

import styles from '@/components/Authentication/authentication.module.less';
import { t } from '@/utils/i18n';
import { requiredField } from '@/components/Form';

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const SignInModal = props => {
  const intl = useIntl();

  const {
    isSignInVisible,
    signInVisible,
    closable,
    handleCancel,
    authModel,
    onFinish,
    setIsSignInVisible,
    setIsRegisterVisible,
    mask = true,
    maskStyle,
    wrapClassName,
    buttons = []
  } = props;

  const modalHeader = (
      <div className={styles.modalHeader}>
        <h4>{t(intl, 'auth.signInTitle')}</h4>
        <h6>{t(intl, 'auth.signInDesc')}</h6>
      </div>
  );

  const passField = t(intl, 'auth.password');

  return (
      <Modal title={modalHeader}
             destroyOnClose={true}
             open={isSignInVisible}
             closable={closable || !signInVisible}
             onCancel={handleCancel}
             className={styles.authModal}
             width={350}
             centered
             mask={mask}
             wrapClassName={wrapClassName}
             maskStyle={maskStyle || signInVisible ? { backgroundColor: 'rgba(0, 0, 0, 0.45)' } : null}
             footer={null}>
        <Form name={'auth_login'}
              className={styles.loginForm}
              size={'large'}
              onFinish={onFinish}>
          <EmailPartial name={'email'}/>
          <Form.Item name={'password'}
                     extra={t(intl, 'auth.passwordHelper', { length: authModel.MIN_PASSWORD_LENGTH })}
                     rules={[
                         requiredField(intl, passField)
                     ]}>
            <Input.Password prefix={<LockTwoTone/>}
                            autoComplete={'new-password'}
                            placeholder={t(intl, 'auth.password')}/>
          </Form.Item>
          <Form.Item>
            <Row gutter={[16, 16]}
                 className={styles.loginBtns}>
              <Col span={12}>
                <Tooltip
                    title={t(intl, 'auth.signInTitle')}>
                  <Button type={'primary'}
                          htmlType={'submit'}
                          icon={<LoginOutlined/>}
                          size={'default'}
                          block>
                    {t(intl, 'auth.signIn')}
                  </Button>
                </Tooltip>
              </Col>
              <Col span={12}>
                <Tooltip title={t(intl, 'auth.registerTitle')}>
                  <Button type={'default'}
                          size={'default'}
                          block
                          onClick={() => handleCancel(() => {
                            setIsSignInVisible(false);
                            setIsRegisterVisible(true);
                          })}
                          icon={<FormOutlined/>}>
                    {t(intl, 'auth.register')}
                  </Button>
                </Tooltip>
              </Col>
            </Row>
          </Form.Item>
          <Divider plain>{t(intl, 'auth.signInWith',{ provider: null })}</Divider>
          <Form.Item style={{ marginBottom: 0 }}>
            <Row gutter={[16, 16]}
                 className={styles.loginBtns}>
              {buttons?.map((button, idx) => (
                  <Col span={8} key={idx}>{button}</Col>
              ))}
            </Row>
          </Form.Item>
        </Form>
      </Modal>
  );
};

export default SignInModal;
