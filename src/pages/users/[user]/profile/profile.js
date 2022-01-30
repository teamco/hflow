import React from 'react';
import { useParams } from 'umi';
import classnames from 'classnames';

import { effectHook } from '@/utils/hooks';

import Page from '@/components/Page';
import Users from 'pages/users';
import Businesses from 'pages/users/[user]/businesses';

import styles from 'pages/users/[user]/profile/profile.module.less';
import userStyles from 'pages/users/users.module.less';

export const profile = (props) => {
  const {
    t,
    authModel,
    userModel,
    loading,
    onGetUser
  } = props;

  const params = useParams();

  const {
    selectedUser
  } = userModel;

  effectHook(() => {
    onGetUser(selectedUser, params.user);
  }, [authModel.user, params.user]);

  const { ability } = authModel;
  const component = 'profile';
  const disabled = ability.cannot('update', component);

  return (
      <Page className={classnames(userStyles.users, styles.profile)}
            component={component}
            spinEffects={[
              'userModel/getUser',
              'userRoleModel/query',
              'businessModel/query'
            ]}>
        <Users selectedUser={selectedUser}/>
        <Businesses selectedUser={selectedUser}
                    style={{ marginTop: 20 }}/>
      </Page>
  );
};
