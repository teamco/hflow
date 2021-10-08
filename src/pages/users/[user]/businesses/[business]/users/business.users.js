import React, {useEffect, useState} from 'react';
import {useParams} from 'umi';
import {Button, PageHeader} from 'antd';
import {
  UserAddOutlined,
  UserOutlined
} from '@ant-design/icons';

import Page from 'components/Page';
import Main from 'components/Main';

import RegisterUser from 'pages/users/[user]/businesses/[business]/users/register.user';
import {expandable, metadata} from 'pages/users/[user]/businesses/[business]/users/business.users.metadata';

import {Can} from 'utils/auth/can';
import {fromForm} from 'utils/object';

import styles from 'pages/users/users.module.less';

const {Table} = Main;

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 */
export const businessUsers = (props) => {
  const {
    t,
    businessModel,
    userRolesModel,
    loading,
    onQuery,
    onUpdateRole,
    onAssignUser,
    onUnassignUser
  } = props;

  let {
    users = [],
    assignedUsers = []
  } = businessModel;

  let {
    entityForm
  } = userRolesModel;

  /**
   * @type {{user, business}}
   */
  const params = useParams();

  const [isRegisterVisible, setIsRegisterVisible] = useState(false);

  useEffect(() => {
    onQuery(params);
  }, []);

  const businessRoles = fromForm(entityForm, 'tags') || [];

  const tableProps = {
    expandable: expandable({
      t,
      businessRoles,
      onUpdateRole
    })
  };

  const registerProps = {
    isRegisterVisible,
    setIsRegisterVisible
  };

  const subTitle = (
      <>
        <UserOutlined style={{marginRight: 10}}/>
        {t('actions:manage', {type: t('business:users')})}
      </>
  );

  const component = 'businessUsers';

  return (
      <Page className={styles.users}
            component={component}
            spinEffects={[
              'businessModel/usersQuery',
              'userRolesModel/query'
            ]}>
        <PageHeader ghost={false}
                    subTitle={subTitle}
                    extra={[
                      <Can I={'assign'} a={component} key={'add'}>
                        <Button size={'small'}
                                icon={<UserAddOutlined />}
                                onClick={() => {
                                  setIsRegisterVisible(true);
                                }}
                                type={'primary'}>
                          {t('actions:addNew', {type: t('auth:user')})}
                        </Button>
                      </Can>
                    ]}/>
        <Table data={assignedUsers}
               {...tableProps}
               {...metadata({
                 t,
                 data: assignedUsers,
                 many: true,
                 loading,
                 onAssignUser,
                 onUnassignUser
               })} />
        <RegisterUser {...registerProps} />
      </Page>
  );
};
