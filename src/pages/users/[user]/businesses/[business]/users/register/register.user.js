import React  from 'react';
import { useParams, useIntl } from 'umi';
import { Button, Form, Modal, Select, Tooltip } from 'antd';
import { FormOutlined } from '@ant-design/icons';

import { emailPartial } from '@/components/partials/email.partial';
import { isOwner } from 'services/userRoles.service';
import { useFocus } from '@/utils/hooks';
import { isLoading } from '@/utils/state';
import { effectHook } from '@/utils/hooks';

import styles from '@/components/Authentication/authentication.module.less';

const { Option } = Select;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export const registerUser = props => {

  const {
    isRegisterVisible,
    setIsRegisterVisible,
    loading,
    authModel,
    userRoleModel,
    onRegisterBusinessUser,
    onQuery
  } = props;

  const { businessRoles = [] } = userRoleModel;

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
    });

    handleCancel(true);
  };

  const { ability } = authModel;
  const disabled = ability.cannot('create', 'businessUsers');

  const roles = [...businessRoles?.roles || []]?.sort().filter(role => !isOwner(role));

  return businessRoles?.roles ? (
      <div className={styles.authWrapper}>
        <>
          <Modal title={intl.formatMessage({id: 'business.registerUser', defaultMessage: 'Register Business users'})}
                 visible={isRegisterVisible}
                 maskClosable={false}
                 onCancel={handleCancel}
                 footer={null}>
            <Form name={'business_user'}
                  className={styles.loginForm}
                  size={'large'}
                  form={formRef}
                  onFinish={onFinish}>
              {emailPartial({ emailRef, name: 'email' })}
              <Form.Item name={'userRoles'}
                         rules={[
                           {
                             required: true,
                             message: intl.formatMessage({id: 'form.required', defaultMessage: '{field} is required'}, { field: intl.formatMessage({id: 'panel.businessRoles', defaultMessage: 'Business Roles'}) })
                           }
                         ]}>
                <Select size={'large'}
                        mode={'multiple'}
                        placeholder={intl.formatMessage({id: 'panel.businessRoles', defaultMessage: 'Business Roles'})}
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
                <Tooltip title={intl.formatMessage({id: 'auth.registerTitle', defaultMessage: 'Not a member? You can create an account'})}>
                  <Button type={'primary'}
                          size={'default'}
                          htmlType={'submit'}
                          block
                          disabled={disabled}
                          loading={isLoading(loading.effects['userRoleModel/query'])}
                          icon={<FormOutlined/>}
                          className={styles.loginBtns}>
                    {intl.formatMessage({id: 'auth.register', defaultMessage: 'Re-Send Invitation'})}
                  </Button>
                </Tooltip>
              </Form.Item>
            </Form>
          </Modal>
        </>
      </div>
  ) : null;
};
