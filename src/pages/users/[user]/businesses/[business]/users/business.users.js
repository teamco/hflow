import React, { useState } from 'react';
import { useParams } from 'umi';
import { Button, PageHeader } from 'antd';
import { UserAddOutlined, UserOutlined } from '@ant-design/icons';

import Page from 'components/Page';
import Main from 'components/Main';

import RegisterUser from 'pages/users/[user]/businesses/[business]/users/register';
import { metadata } from 'pages/users/[user]/businesses/[business]/users/business.users.metadata';
import { expandable } from 'pages/users/[user]/businesses/[business]/users/metadata/business.user.expandable';

import { Can } from 'utils/auth/can';
import { fromForm } from 'utils/object';

import styles from 'pages/users/users.module.less';
import { effectHook } from '@/utils/hooks';

const { Table } = Main;

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 */
export const businessUsers = (props) => {
  const {
    t,
    businessModel,
    userRoleModel,
    userModel,
    onSendVerification,
    onResendRegisterLink,
    loading,
    onQuery,
    onUpdateRole,
    onAssignUser,
    onUnassignUser
  } = props;

  let {
    verificationSent
  } = userModel;

  let {
    users = [],
    assignedUsers = []
  } = businessModel;

  let {
    entityForm
  } = userRoleModel;

  /**
   * @type {{user, business}}
   */
  const params = useParams();

  const [isRegisterVisible, setIsRegisterVisible] = useState(false);

  effectHook(() => {
    onQuery(params);
  }, []);

  const businessRoles = fromForm(entityForm, 'tags') || [];

  const component = 'businessUsers';

  const tableProps = {
    expandable: expandable({
      t,
      businessRoles,
      onUpdateRole,
      component,
      verificationSent,
      onSendVerification,
      onResendRegisterLink
    })
  };

  const registerProps = {
    isRegisterVisible,
    setIsRegisterVisible
  };

  const subTitle = (
      <>
        <UserOutlined style={{ marginRight: 10 }}/>
        {t('actions:manage', { type: t('business:users') })}
      </>
  );

  return (
      <Page className={styles.users}
            component={component}
            spinEffects={[
              'businessModel/usersQuery',
              'userRoleModel/query'
            ]}>
        <PageHeader ghost={false}
                    subTitle={subTitle}
                    extra={[
                      <Can I={'assign'} a={component} key={'add'}>
                        <Button size={'small'}
                                icon={<UserAddOutlined/>}
                                onClick={() => {
                                  setIsRegisterVisible(true);
                                }}
                                type={'primary'}>
                          {t('actions:addNew', { type: t('auth:user') })}
                        </Button>
                      </Can>
                    ]}/>
        <Table data={assignedUsers}
               {...tableProps}
               {...metadata({
                 t,
                 data: assignedUsers,
                 multiple: true,
                 loading,
                 onAssignUser,
                 onUnassignUser,
                 onResendRegisterLink
               })} />
        <RegisterUser {...registerProps} />
      </Page>
  );
};
