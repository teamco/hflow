import React, { useEffect } from 'react';
import { connect } from 'dva';
import { useParams } from 'umi';
import { withTranslation } from 'react-i18next';

import Page from 'components/Page';
import Users from 'pages/users';
import Businesses from 'pages/users/[user]/businesses';

import styles from 'pages/users/[user]/profile/profile.module.less';
import userStyles from 'pages/users/users.module.less';

const profile = (props) => {
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

  useEffect(() => {
    onGetUser(selectedUser, params.user);
  }, [authModel.user]);

  const { ability } = authModel;
  const component = 'profile';
  const disabled = !ability.can('update', component);

  return (
    <Page className={userStyles.users}
          component={component}
          spinEffects={[
            'userModel/getUser',
            'businessModel/query'
          ]}>
      <Users selectedUser={selectedUser} />
      <Businesses selectedUser={selectedUser}
                  style={{ marginTop: 20 }} />
    </Page>
  );
};

export default connect(
  ({ authModel, userModel, loading }) => {
    return {
      authModel,
      userModel,
      loading
    };
  },
  (dispatch) => ({
    dispatch,
    onGetUser(selectedUser, userId) {
      dispatch({ type: `userModel/getUser`, payload: { selectedUser, userId } });
    }
  })
)(withTranslation()(profile));
