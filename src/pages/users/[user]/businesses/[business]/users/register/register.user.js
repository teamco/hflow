import React, {useEffect} from 'react';
import {useParams} from 'umi';
import {Form, Select, Button, Modal, Tooltip} from 'antd';
import {
  FormOutlined
} from '@ant-design/icons';

import {emailPartial} from 'components/partials/email.partial';
import {isOwner} from 'services/userRoles.service';
import {useFocus} from 'utils/dom';
import {isLoading} from 'utils/state';

import styles from 'components/Authentication/authentication.module.less';

const {Option} = Select;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export const registerUser = props => {

  const {
    t,
    isRegisterVisible,
    setIsRegisterVisible,
    loading,
    authModel,
    userRolesModel,
    onRegisterBusinessUser,
    onQuery
  } = props;

  const {businessRoles = []} = userRolesModel;

  /**
   * @type {{user, business}}
   */
  const params = useParams();

  const [formRef] = Form.useForm();
  const [emailRef, setEmailFocus] = useFocus();

  useEffect(() => {
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

  const {ability} = authModel;
  const disabled = ability.cannot('create', 'businessUsers');

  const roles = [...businessRoles?.roles || []]?.sort().filter(role => !isOwner(role));

  return businessRoles?.roles ? (
      <div className={styles.authWrapper}>
        <>
          <Modal title={t('business:registerUser')}
                 visible={isRegisterVisible}
                 maskClosable={false}
                 onCancel={handleCancel}
                 footer={null}>
            <Form name={'business_user'}
                  className={styles.loginForm}
                  size={'large'}
                  form={formRef}
                  onFinish={onFinish}>
              {emailPartial({t, emailRef, name: 'email'})}
              <Form.Item name={'userRoles'}
                         rules={[
                           {
                             required: true,
                             message: t('form:required', {field: t('panel:businessRoles')})
                           }
                         ]}>
                <Select size={'large'}
                        mode={'multiple'}
                        placeholder={t('panel:businessRoles')}
                        style={{width: '100%'}}>
                  {roles.map((role, idx) => (
                      <Option key={idx}
                              value={role}>
                        {role}
                      </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item style={{marginBottom: 0, marginTop: 20}}>
                <Tooltip title={t('auth:registerTitle')}>
                  <Button type={'primary'}
                          size={'default'}
                          htmlType={'submit'}
                          block
                          disabled={disabled}
                          loading={isLoading(loading.effects['userRolesModel/query'])}
                          icon={<FormOutlined/>}
                          className={styles.loginBtns}>
                    {t('auth:register')}
                  </Button>
                </Tooltip>
              </Form.Item>
            </Form>
          </Modal>
        </>
      </div>
  ) : null;
};
