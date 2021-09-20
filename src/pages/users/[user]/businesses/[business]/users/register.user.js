import React, { useEffect, useRef } from 'react';
import { connect } from 'dva';
import { useParams } from 'umi';
import { withTranslation } from 'react-i18next';
import { Form, Select, Button, Modal, Tooltip } from 'antd';
import {
  FormOutlined
} from '@ant-design/icons';

import { emailPartial } from 'components/partials/email.partial';
import { isOwner } from 'services/business.service';

import styles from 'components/Authentication/authentication.module.less';
import { useFocus } from 'utils/dom';
import { isLoading } from 'utils/state';

const { Option } = Select;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
const registerUser = props => {

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

  const { tags = [] } = userRolesModel;

  /**
   * @type {{user, business}}
   */
  const params = useParams();

  const [emailRef, setEmailFocus] = useFocus();

  useEffect(() => {
    onQuery();
    isRegisterVisible && setEmailFocus();
  }, [isRegisterVisible]);

  const handleCancel = () => {
    setIsRegisterVisible(false);
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

    handleCancel();
  };

  const { ability } = authModel;
  const disabled = ability.cannot('create', 'businessUsers');

  return (
    <div className={styles.authWrapper}>
      <>
        <Modal title={t('business:registerUser')}
               visible={isRegisterVisible}
               forceRender={true}
               onCancel={handleCancel}
               footer={null}>
          <Form name={'business_user'}
                className={styles.loginForm}
                size={'large'}
                onFinish={onFinish}>
            {emailPartial({ t, emailRef, name: 'email' })}
            <Form.Item name={'userRoles'}
                       rules={[
                         {
                           required: true,
                           message: t('form:required', { field: t('business:userRoles') })
                         }
                       ]}>
              <Select size={'large'}
                      placeholder={t('business:userRoles')}
                      style={{ width: '100%' }}>
                {Array.from(tags).sort().map((role, idx) => (
                  <Option key={idx}
                          disabled={isOwner(role)}
                          value={role}>
                    {role}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item style={{ marginBottom: 0, marginTop: 20 }}>
              <Tooltip title={t('auth:registerTitle')}>
                <Button type={'primary'}
                        size={'default'}
                        htmlType={'submit'}
                        block
                        disabled={disabled}
                        loading={isLoading(loading.effects['userRolesModel/query'])}
                        icon={<FormOutlined />}
                        className={styles.loginBtn}>
                  {t('auth:register')}
                </Button>
              </Tooltip>
            </Form.Item>
          </Form>
        </Modal>
      </>
    </div>
  );
};

export default connect(
  ({ authModel, userRolesModel, loading }) => {
    return {
      authModel,
      userRolesModel,
      loading
    };
  },
  (dispatch) => ({
    dispatch,
    onQuery() {
      dispatch({ type: `userRolesModel/query` });
    },
    onRegisterBusinessUser(data) {
      dispatch({ type: 'businessModel/sendRegisterLinkBusinessUser', payload: { data } });
    }
  })
)(withTranslation()(registerUser));
