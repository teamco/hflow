import React from 'react';
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Spin,
  Tooltip
} from 'antd';
import { FormOutlined, LockTwoTone, LoginOutlined } from '@ant-design/icons';
import { useIntl, history } from '@umijs/max';

import { EmailPartial } from '@/components/partials/email.partial';
import { requiredField } from '@/components/Form';
import Logo from '@/components/Logo';

import { SocialButtons }
  from '@/pages/landing/authentication/social/social.buttons';

import { t } from '@/utils/i18n';
import { isSpinning } from '@/utils/state';

import styles from '@/pages/landing/authentication/login/login.module.less';

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const LoginForm = props => {
  const intl = useIntl();

  const {
    models: {
      authModel,
      landingModel
    },
    onFinish,
    disabled,
    error,
    mask = true,
    wrapClassName,
    buttons = [],
    loading,
    formRef,
    user
  } = props;

  const logoProps = {
    imgSrc: landingModel.icon,
    className: styles.logo
  };

  const modalHeader = (
      <div className={styles.modalHeader}>
        <h4>{t(intl, 'auth.signInTitle')}</h4>
        <h6>{t(intl, 'auth.signInDesc')}</h6>
        <Logo {...logoProps} />
      </div>
  );

  const passField = t(intl, 'auth.password');

  const isLoading = isSpinning(loading, ['authModel/signIn']);

  return (
      <Modal title={modalHeader}
             closable={false}
             width={400}
             centered
             open={true}
             mask={mask}
             wrapClassName={wrapClassName}
             footer={null}>
        <Spin spinning={isSpinning(loading, [
          'authModel/signIn',
          'authModel/defineAbilities',
          'firebaseModel/signInWithPassword',
          'firebaseModel/signInWithGoogle',
          'firebaseModel/refreshSignIn'
        ], !!user)}>
          <Form name={'landing_login'}
                size={'large'}
                form={formRef}
                onFinish={onFinish}>
            <Divider plain>
              {t(intl, 'auth.signInRegistered')}
            </Divider>
            <EmailPartial disabled={isLoading || disabled}
                          name={'email'}/>
            <Form.Item name={'password'}
                       extra={t(intl, 'auth.passwordHelper',
                           { length: authModel.MIN_PASSWORD_LENGTH })}
                       rules={[requiredField(intl, passField)]}>
              <Input.Password prefix={<LockTwoTone/>}
                              disabled={isLoading || disabled}
                              autoComplete={'new-password'}
                              placeholder={t(intl, 'auth.password')}/>
            </Form.Item>
            <Form.Item>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Tooltip title={t(intl, 'auth.signInTitle')}>
                    <Button type={'primary'}
                            htmlType={'submit'}
                            icon={<LoginOutlined/>}
                            size={'default'}
                            disabled={disabled}
                            loading={isLoading}
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
                            loading={isLoading}
                            disabled={disabled}
                            onClick={() => history.push('/register')}
                            icon={<FormOutlined/>}>
                      {t(intl, 'auth.register')}
                    </Button>
                  </Tooltip>
                </Col>
              </Row>
            </Form.Item>
            <SocialButtons disabled={disabled}
                           spinning={isLoading}
                           buttons={buttons}/>
          </Form>
        </Spin>
      </Modal>
  );
};

export default LoginForm;
