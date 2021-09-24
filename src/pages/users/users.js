import React, {useEffect, useState} from 'react';
import {connect} from 'dva';
import {PageHeader, message, Button} from 'antd';
import {
  UserSwitchOutlined,
  SaveOutlined
} from '@ant-design/icons';
import {withTranslation} from 'react-i18next';

import i18n from 'utils/i18n';

import Page from 'components/Page';
import Main from 'components/Main';

import {isLoading} from 'utils/state';
import {metadata} from 'pages/users/users.metadata';
import {expendableProfile} from 'pages/users/[user]/profile/profile.metadata';

import styles from 'pages/users/users.module.less';

const {Table} = Main;

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 */
const users = (props) => {
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
    onLockUser
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

  const subTitle = (
      <>
        <UserSwitchOutlined style={{marginRight: 10}}/>
        {t('actions:manage', {type: t('auth:users')})}
      </>
  );

  const {ability} = authModel;
  const component = 'users';
  const disabled = !ability.can('update', component);

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
                          <Button key={'save'}
                                  size={'small'}
                                  disabled={isDisabled()}
                                  loading={isLoading(loading.effects['userModel/updateRoles'])}
                                  icon={<SaveOutlined/>}
                                  onClick={updateProfile}
                                  type={'primary'}>
                            {t('actions:update')}
                          </Button>
                      )
                    ]}/>
        <Table data={data}
               {...tableProps}
               {...metadata({
                 t,
                 data,
                 many: !selectedUser,
                 loading,
                 currentUser: authModel.user,
                 onDeleteUser,
                 onSignOutUser,
                 onUnlockUser,
                 onLockUser
               })} />
      </Page>
  );
};

export default connect(
    ({authModel, userModel, userRolesModel, loading}) => ({
      authModel,
      userModel,
      userRolesModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onRolesQuery() {
        dispatch({type: `userRolesModel/query`});
      },
      onUpdateRoles(selectedUser, roles) {
        dispatch({type: `userModel/updateRoles`, payload: {selectedUser, roles}});
      },
      onQuery() {
        dispatch({type: `userModel/query`});
      },
      onDeleteUser(user) {
        dispatch({type: `userModel/delete`, payload: {user}});
      },
      onSignOutUser(user) {
        dispatch({type: `userModel/signOutUser`, payload: {user}});
      },
      onLockUser(user) {
        dispatch({type: `userModel/lock`, payload: {user}});
      },
      onUnlockUser(user) {
        dispatch({type: `userModel/unlock`, payload: {user}});
      },
      onSendVerification(user) {
        if (user.email) {
          dispatch({type: `userModel/sendVerification`, payload: {user}});
        } else {
          message.warning(i18n.t('msg:errorSentEmail')).then();
          message.warning(i18n.t('error:noEmail')).then();
        }
      }
    })
)(withTranslation()(users));
