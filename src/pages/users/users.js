import React, {useEffect, useState} from 'react';
import {PageHeader, Button} from 'antd';
import {
  UserSwitchOutlined,
  SaveOutlined
} from '@ant-design/icons';
import {Can} from 'utils/auth/can';

import Page from 'components/Page';
import Main from 'components/Main';

import {isLoading} from 'utils/state';
import {metadata} from 'pages/users/users.metadata';
import {expendableProfile} from 'pages/users/[user]/profile/profile.metadata';
import SendMessage from 'pages/users/metadata/send.message';

import styles from 'pages/users/users.module.less';

const {Table} = Main;

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
    onSendVerification,
    onDeleteUser,
    onSignOutUser,
    onUnlockUser,
    onLockUser,
    onSendMessage
  } = props;

  let {
    data = [],
    verificationSent
  } = userModel;

  const {userRoles, businessRoles} = userRolesModel;

  data = selectedUser ? [selectedUser] : data;

  useEffect(() => {
    onQuery();
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
  const [rowEnabled, setRowEnabled] = useState(false);
  const [visibleMessage, setVisibleMessage] = useState(false);

  const subTitle = (
      <>
        <UserSwitchOutlined style={{marginRight: 10}}/>
        {t('actions:manage', {type: t('auth:users')})}
      </>
  );

  const {ability} = authModel;
  const component = 'users';
  const disabled = ability.cannot('update', component);

  const rowProps = {
    onRow: (record, rowIndex) => {
      return {
        onMouseEnter: event => {
          event.preventDefault();
          setRowEnabled(rowIndex);
        },
        onMouseLeave: event => {
          event.preventDefault();
          setRowEnabled(false);
        }
      };
    }
  };

  const tableProps = selectedUser ? {
    ...rowProps,
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
  } : {...rowProps};

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
    } else {
      return disabled;
    }
  };

  return (
      <Page className={styles.users}
            component={component}
            touched={!isDisabled() && touched}
            spinEffects={['authModel/defineAbilities']}>
        <PageHeader ghost={false}
                    subTitle={subTitle}
                    extra={[
                      selectedUser && (
                          <Can I={'update'} a={component} key={'save'}>
                            <Button size={'small'}
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
        <Table data={data}
               {...tableProps}
               {...metadata({
                 t,
                 ability,
                 data,
                 rowEnabled,
                 loading,
                 multiple: !selectedUser,
                 currentUser: authModel.user,
                 visibleMessage,
                 setVisibleMessage,
                 onDeleteUser,
                 onSignOutUser,
                 onUnlockUser,
                 onLockUser
               })} />
        <SendMessage {...sendProps}/>
      </Page>
  );
};
