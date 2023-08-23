import React, { useRef, useState } from 'react';
import { useParams, useIntl } from '@umijs/max';
import { Button } from 'antd';
import { UserAddOutlined, UserOutlined } from '@ant-design/icons';

import Page from '@/components/Page/page.connect';
import Main from '@/components/Main';
import { SubHeader } from '@/components/Page/page.subheader';

import RegisterUser from '@/pages/users/[user]/businesses/[business]/users/register';
import { metadata } from '@/pages/users/[user]/businesses/[business]/users/business.users.metadata';
import { expandable } from '@/pages/users/[user]/businesses/[business]/users/metadata/business.user.expandable';

import { effectHook } from '@/utils/hooks';
import { t } from '@/utils/i18n';
import { Can } from '@/utils/auth/can';
import { fromForm } from '@/utils/object';

import styles from '@/pages/users/users.module.less';
import { componentAbilities } from '@/utils/auth/component.setting';

const { Table } = Main;

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 */
export const businessUsers = (props) => {
  const intl = useIntl();

  const {
    businessModel,
    roleModel,
    userModel,
    authModel,
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
  } = roleModel;

  /**
   * @type {{user, business}}
   */
  const params = useParams();

  const [isRegisterVisible, setIsRegisterVisible] = useState(false);

  effectHook(() => {
    onQuery(params);
  }, []);

  const component = 'business.users';
  const {
    ability,
    disabled,
    canUpdate,
    canDelete,
    canExport
  } = componentAbilities(authModel, component, true);

  const MODEL_NAME = 'businessModel';

  const refTarget = useRef(null);

  const businessRoles = fromForm(entityForm, 'tags') || [];

  const tableProps = {
    expandable: expandable({
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
        {t(intl, 'business.actions.manage')}
      </>
  );

  const pageHeaderProps = {
    subTitle,
    loading,
    disabled,
    MODEL_NAME,
    component,
    actions: {
      exportBtn: { refTarget, data: assignedUsers, disabled: !canExport },
      closeBtn: false,
      newBtn: false,
      saveBtn: false,
      menuBtn: false,
      extra: [
        <Can I={'assign'} a={component} key={'add'}>
          <Button size={'small'}
                  icon={<UserAddOutlined/>}
                  onClick={() => {
                    setIsRegisterVisible(true);
                  }}
                  type={'primary'}>
            {t(intl, 'actions.addNew')}
          </Button>
        </Can>
      ]
    }
  };

  return (
      <Page className={styles.users}
            component={component}
            spinEffects={[
              'businessModel/usersQuery',
              'roleModel/query'
            ]}>
        <SubHeader {...pageHeaderProps}/>
        <Table data={assignedUsers}
               {...tableProps}
               {...metadata({
                 data: assignedUsers,
                 multiple: true,
                 disabled,
                 loading,
                 onAssignUser,
                 onUnassignUser,
                 onResendRegisterLink
               })} />
        <RegisterUser {...registerProps} />
      </Page>
  );
};
