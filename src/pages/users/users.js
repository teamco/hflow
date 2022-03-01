import React, { useState } from 'react';
import { Button, PageHeader } from 'antd';
import { SaveOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';
import { Can } from '@/utils/auth/can';
import { isLoading } from '@/utils/state';
import { effectHook } from '@/utils/hooks';

import Page from '@/components/Page';
import Main from '@/components/Main';

import { metadata } from '@/pages/users/users.metadata';
import { expendableProfile } from '@/pages/users/[user]/profile/profile.metadata';
import SendMessage from '@/pages/users/metadata/send.message';

import styles from '@/pages/users/users.module.less';
import { userCardMetadata } from './metadata/user.card';
import ExportButton from '@/components/Buttons/export.button';

const { Table, Card } = Main;

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 */
export const users = (props) => {
  const intl = useIntl();
  const {
    authModel,
    userModel,
    userRoleModel,
    loading,
    selectedUser,
    onUpdateRoles,
    onRolesQuery,
    onQuery,
    onChangeGridLayout,
    onSendVerification,
    onDeleteUser,
    onSignOutUser,
    onUnlockUser,
    onLockUser,
    onSendMessage
  } = props;

  let {
    data = [],
    gridLayout,
    verificationSent
  } = userModel;

  const { userRoles, businessRoles } = userRoleModel;

  data = selectedUser ? [selectedUser] : data;

  effectHook(() => {
    !selectedUser && onQuery();
    onRolesQuery();
  }, [authModel.user]);

  effectHook(() => {
    if (selectedUser?.roles) {
      const _current = [...currentRoles].sort();
      const _selected = [...selectedUser?.roles || []].sort();
      const _diff = JSON.stringify(_current) !== JSON.stringify(_selected);

      if (_diff) {
        setCurrentRoles(selectedUser?.roles);
      }
    }
  }, [selectedUser]);

  const [touched, setTouched] = useState(userModel.touched);
  const [currentRoles, setCurrentRoles] = useState(selectedUser?.roles || []);
  const [visibleMessage, setVisibleMessage] = useState({ visible: false, props: {} });

  const subTitle = (
      <>
        <UserSwitchOutlined style={{ marginRight: 10 }}/>
        {intl.formatMessage({id: 'user.actions.manage', defaultMessage: 'Manage User'})}
      </>
  );

  const { ability } = authModel;
  const component = 'users';
  const disabled = ability.cannot('update', component);

  const tableProps = selectedUser ? {
    pagination: false,
    expandable: expendableProfile(
        authModel?.user?.roles,
        component,
        verificationSent,
        onSendVerification,
        selectedUser,
        userRoles,
        businessRoles,
        currentRoles,
        setCurrentRoles,
        setTouched
    )
  } : {};

  const sendProps = {
    onSendMessage,
    visibleMessage,
    setVisibleMessage
  };

  const updateProfile = () => {
    onUpdateRoles(selectedUser, currentRoles);
    setTouched(false);
  };

  /**
   * @constant
   * @return {boolean}
   */
  const isDisabled = () => {
    if (selectedUser) {
      const _current = [...currentRoles].sort();
      const _selected = [...selectedUser?.roles || []].sort();
      const _equal = JSON.stringify(_current) === JSON.stringify(_selected);
      return disabled || _equal;
    }

    return disabled;
  };

  const userProps = {
    loading,
    ability,
    currentUser: authModel.user,
    multiple: !selectedUser,
    onSignOutUser,
    onSendMessage,
    onLockUser,
    onUnlockUser,
    onDeleteUser,
    setVisibleMessage
  };

  return (
      <Page className={styles.users}
            component={component}
            touched={!isDisabled() && touched}
            spinEffects={['authModel/defineAbilities']}>
        <PageHeader ghost={false}
                    subTitle={subTitle}
                    extra={[
                      // <Button key={'layout'}
                      //         size={'small'}
                      //         icon={<LayoutOutlined/>}
                      //         onClick={onChangeGridLayout}
                      //         type={'primary'}/>,
                      <ExportButton key={'export'}
                                    disabled={disabled}
                                    component={component}
                                    json={data}/>,
                      selectedUser && (
                          <Can I={'update'} a={component} key={'save'}>
                            <Button key={'update'}
                                    size={'small'}
                                    disabled={isDisabled()}
                                    loading={isLoading(loading.effects['userModel/updateRoles'])}
                                    icon={<SaveOutlined/>}
                                    onClick={updateProfile}
                                    type={'primary'}>
                              {intl.formatMessage({id: 'actions.update', defaultMessage: 'Update'})}
                            </Button>
                          </Can>
                      )
                    ]}/>
        {gridLayout ? (
            <Table data={data}
                   {...tableProps}
                   {...metadata({
                     t,
                     data,
                     visibleMessage,
                     ...userProps
                   })} />
        ) : (
            <div className={styles.userCards}>
              {data.map((user, idx) => {
                const props = {
                  ...userCardMetadata(t, {
                    user,
                    className: styles.userCard,
                    ...userProps
                  })
                };

                return (<Card key={idx} {...props} />);
              })}
            </div>
        )}
        <SendMessage {...sendProps}/>
      </Page>
  );
};
