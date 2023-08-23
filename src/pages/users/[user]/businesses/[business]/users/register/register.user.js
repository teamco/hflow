import React from 'react';
import { useIntl, useParams } from '@umijs/max';
import { Button, Form, Modal, Select, Tooltip } from 'antd';
import { FormOutlined } from '@ant-design/icons';

import { EmailPartial } from '@/components/partials/email.partial';
import { isOwner } from '@/services/userRoles.service';
import { effectHook, useFocus } from '@/utils/hooks';
import { isLoading } from '@/utils/state';

import styles from '@/components/Authentication/authentication.module.less';
import { t } from '@/utils/i18n';
import { requiredField } from '@/components/Form';

const { Option } = Select;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export const registerUser = props => {

  const intl = useIntl();

  const {
    isRegisterVisible,
    setIsRegisterVisible,
    loading,
    authModel,
    roleModel,
    onRegisterBusinessUser,
    onQuery
  } = props;

  const { businessRoles = [] } = roleModel;

  /**
   * @type {{user, business}}
   */
  const params = useParams();

  const [formRef] = Form.useForm();
  const [emailRef, setEmailFocus] = useFocus();

  effectHook(() => {
    onQuery();
    isRegisterVisible && setEmailFocus();
  }, [isRegisterVisible]);

  /**
   * @constant
   * @param {boolean} [clean]
   */
  const handleCancel = (clean = false) => {
    setIsRegisterVisible(false);

    // Clean form fields
    clean && formRef.setFieldsValue({
      email: null,
      userRoles: []
    });
  };

  /**
   * @constant
   * @param values
   */
  const onFinish = values => {
    onRegisterBusinessUser({
      email: values.email,
      userRoles: values.userRoles,
      ...params
    }, intl);

    handleCancel(true);
  };

  const { ability } = authModel;
  const disabled = ability.cannot('create', 'business.users');

  const roles = [...businessRoles?.roles || []]?.sort().filter(role => !isOwner(role));
  const businessRolesField = t(intl, 'panel.businessRoles');

  return businessRoles?.roles ? (
      <div className={styles.authWrapper}>
        <>
          <Modal title={t(intl, 'business.registerUser')}
                 open={isRegisterVisible}
                 maskClosable={false}
                 onCancel={handleCancel}
                 footer={null}>
            <Form name={'business_user'}
                  className={styles.loginForm}
                  size={'large'}
                  form={formRef}
                  onFinish={onFinish}>
              <EmailPartial emailRef={emailRef} name={'email'}/>
              <Form.Item name={'userRoles'}
                         rules={[requiredField(intl, businessRolesField)]}>
                <Select size={'large'}
                        mode={'multiple'}
                        placeholder={t(intl, 'panel.businessRoles')}
                        style={{ width: '100%' }}>
                  {roles.map((role, idx) => (
                      <Option key={idx}
                              value={role}>
                        {role}
                      </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item style={{ marginBottom: 0, marginTop: 20 }}>
                <Tooltip title={t(intl, 'auth.registerTitle')}>
                  <Button type={'primary'}
                          size={'default'}
                          htmlType={'submit'}
                          block
                          disabled={disabled}
                          loading={isLoading(loading.effects['roleModel/query'])}
                          icon={<FormOutlined/>}
                          className={styles.loginBtns}>
                    {t(intl, 'auth.register')}
                  </Button>
                </Tooltip>
              </Form.Item>
            </Form>
          </Modal>
        </>
      </div>
  ) : null;
};
