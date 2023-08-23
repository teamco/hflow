import { connect } from '@umijs/max';

import { profile } from './profile';
import { t } from '@/utils/i18n';

const MODEL_NAME = 'userModel';

export default connect(
    ({ authModel, userModel, roleModel, loading }) => {
      return {
        authModel,
        userModel,
        roleModel,
        loading
      };
    },
    (dispatch) => ({
      dispatch,
      onGetUser(selectedUser, userId) {
        dispatch(
            { type: `${MODEL_NAME}/getUser`, payload: { selectedUser, userId } });
      },
      onRolesQuery() {
        dispatch({
          type: `roleModel/query`,
          payload: { component: 'business.roles', docName: 'businessRoles' }
        });
        dispatch({
          type: `roleModel/query`,
          payload: { component: 'user.roles', docName: 'userRoles' }
        });
      },
      onUpdateRoles(selectedUser, roles) {
        dispatch({
          type: `${MODEL_NAME}/updateRoles`,
          payload: { selectedUser, roles }
        });
      },
      onDeleteUser(user) {
        dispatch({ type: `${MODEL_NAME}/delete`, payload: { user } });
      },
      onSignOutUser(user) {
        dispatch({ type: `${MODEL_NAME}/signOutUser`, payload: { user } });
      },
      onLockUser(user) {
        dispatch({ type: `${MODEL_NAME}/lock`, payload: { user } });
      },
      onUnlockUser(user) {
        dispatch({ type: `${MODEL_NAME}/unlock`, payload: { user } });
      },
      onSendMessage({ props }, fields) {
        dispatch({
          type: 'notificationModel/createAndUpdate',
          payload: {
            type: 'notifications.message',
            title: fields.title,
            description: fields.description,
            status: 'status.sent',
            isPrivate: fields.isPrivate,
            sentTo: props.to.email
          }
        });
      },
      onSendVerification(user, intl) {
        if (user.email) {
          dispatch({ type: `${MODEL_NAME}/sendVerification`, payload: { user } });
        } else {
          // message.warning(t(intl, 'msg.errorSentEmail')).then(async () => {
          //   await message.warning(t(intl, 'error.noEmail'));
          // });
          return console.warn(t(intl, 'error.noEmail'));
        }
      },
      onRefreshPage(selectedUser, paramsUser) {
        dispatch({
          type: `landingModel/refreshPage`,
          payload: { selectedUser, paramsUser }
        });
      }
    })
)(profile);
