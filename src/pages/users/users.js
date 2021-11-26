import React, { useEffect, useState } from 'react';
import { Button, PageHeader } from 'antd';
import { SaveOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { Can } from 'utils/auth/can';

import Page from 'components/Page';
import Main from 'components/Main';

import { isLoading } from 'utils/state';
import { metadata } from 'pages/users/users.metadata';
import { expendableProfile } from 'pages/users/[user]/profile/profile.metadata';
import SendMessage from 'pages/users/metadata/send.message';

import styles from 'pages/users/users.module.less';
import { userCardMetadata } from './metadata/user.card';

const { Table, Card } = Main;

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 */
export const users = (props) => {
  const {
    t,
    authModel,
    userModel,
    userRolesModel,
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

  const { userRoles, businessRoles } = userRolesModel;

  data = selectedUser ? [selectedUser] : data;

  useEffect(() => {
    !selectedUser && onQuery();
    onRolesQuery();
  }, [authModel.user]);

  useEffect(() => {
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
        {t('actions:manage', { type: t('auth:users') })}
      </>
  );

  const { ability } = authModel;
  const component = 'users';
  const disabled = ability.cannot('update', component);

  const tableProps = selectedUser ? {
    pagination: false,
    expandable: expendableProfile(
        t,
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
    t,
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
                      selectedUser && (
                          <Can I={'update'} a={component} key={'save'}>
                            <Button key={'update'}
                                    size={'small'}
                                    disabled={isDisabled()}
                                    loading={isLoading(loading.effects['userModel/updateRoles'])}
                                    icon={<SaveOutlined/>}
                                    onClick={updateProfile}
                                    type={'primary'}>
                              {t('actions:update')}
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
