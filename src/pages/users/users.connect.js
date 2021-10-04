import {connect} from 'dva';
import {message} from 'antd';
import i18n from 'utils/i18n';

import {withTranslation} from 'react-i18next';
import {users} from './users';

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
