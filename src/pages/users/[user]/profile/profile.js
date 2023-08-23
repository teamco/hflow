import React, { useRef, useState } from 'react';
import { useIntl, useParams } from '@umijs/max';
import classnames from 'classnames';
import { UserSwitchOutlined } from '@ant-design/icons';

import { effectHook } from '@/utils/hooks';
import { t } from '@/utils/i18n';
import { componentAbilities } from '@/utils/auth/component.setting';

import { expendableProfile } from '@/pages/users/[user]/profile/profile.metadata';
import { metadata } from '@/pages/users/users.metadata';
import SendMessage from '@/pages/users/metadata/send.message';
import PageWarning from '@/pages/warning';

import Page from '@/components/Page/page.connect';
import Businesses from '@/pages/users/[user]/businesses';
import Main from '@/components/Main';
import { SubHeader } from '@/components/Page/page.subheader';

import styles from '@/pages/users/[user]/profile/profile.module.less';
import userStyles from '@/pages/users/users.module.less';

const { Table } = Main;

export const profile = (props) => {
  const intl = useIntl();

  const {
    authModel,
    userModel,
    roleModel,
    loading,
    onGetUser,
    onRolesQuery,
    onSendVerification,
    onSendMessage,
    onUpdateRoles,
    onSignOutUser,
    onLockUser,
    onUnlockUser,
    onDeleteUser,
    onRefreshPage
  } = props;

  const params = useParams();

  let { verificationSent, selectedUser } = userModel;

  const { userRoles, businessRoles } = roleModel;

  effectHook(() => {
    if (authModel.user) {
      onGetUser(selectedUser, params.user);
      onRolesQuery();
    }
  }, [authModel.user]);

  const component = 'user.profile';
  const {
    ability,
    ableFor,
    disabled,
    canUpdate,
    canExport
  } = componentAbilities(authModel, component, true);

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
        {t(intl, 'user.actions.manage')}
      </>
  );

  const tableProps = {
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
  };

  const sendProps = {
    onSendMessage,
    visibleMessage,
    setVisibleMessage
  };

  const updateProfile = () => {
    if (canUpdate) {
      onUpdateRoles(selectedUser, currentRoles);
      setTouched(false);
      onSendMessage({
        props: { to: { email: selectedUser.email } }
      }, {
        title: t(intl, 'msg.changedRoles.title'),
        description: t(intl, 'msg.changedRoles.description'),
        isPrivate: true
      });

      // TODO (teamco): Show notification to affected user.
      onRefreshPage(selectedUser, params.user);
    }
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
    multiple: false,
    onSendMessage,
    onSignOutUser,
    onLockUser,
    onUnlockUser,
    onDeleteUser,
    setVisibleMessage
  };

  const MODEL_NAME = 'userModel';
  const refTarget = useRef(null);

  const pageHeaderProps = {
    subTitle,
    loading,
    disabled: isDisabled(),
    MODEL_NAME,
    component,
    isEdit: true,
    actions: {
      closeBtn: false,
      menuBtn: false,
      newBtn: false,
      saveBtn: { ableFor, touched, onClick: updateProfile },
      exportBtn: { refTarget, data: [selectedUser], disabled: !canExport }
    }
  };

  return (
      <Page className={classnames(userStyles.users, styles.profile)}
            component={component}
            touched={!isDisabled() && touched}
            ableFor={ableFor}
            spinEffects={[
              `${MODEL_NAME}/getUser`,
              `${MODEL_NAME}/updateRoles`,
              'roleModel/query'
            ]}>
        <SubHeader {...pageHeaderProps}/>
        {selectedUser ? (
            <div ref={refTarget}>
              <Table data={[selectedUser]}
                     {...tableProps}
                     {...metadata({
                       data: [selectedUser],
                       intl,
                       ...userProps
                     })} />
              <SendMessage {...sendProps}/>
              <Businesses selectedUser={selectedUser}
                          style={{ marginTop: 20 }}/>
            </div>
        ) : (
            <PageWarning/>
        )}
      </Page>
  );
};
