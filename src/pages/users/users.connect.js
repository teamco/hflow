import { connect, useIntl } from 'umi';
import { message } from 'antd';
import i18n from '@/utils/i18n';

import { users } from './users';
import { STATUS } from '@/utils/message';

export default connect(
    ({ authModel, userModel, userRoleModel, loading }) => ({
      authModel,
      userModel,
      userRoleModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onRolesQuery() {
        dispatch({ type: `userRoleModel/query` });
      },
      onUpdateRoles(selectedUser, roles) {
        dispatch({ type: `userModel/updateRoles`, payload: { selectedUser, roles } });
      },
      onQuery() {
        dispatch({ type: `userModel/query` });
      },
      onChangeGridLayout() {
        dispatch({ type: `userModel/changeGridLayout` });
      },
      onDeleteUser(user) {
        dispatch({ type: `userModel/delete`, payload: { user } });
      },
      onSignOutUser(user) {
        dispatch({ type: `userModel/signOutUser`, payload: { user } });
      },
      onLockUser(user) {
        dispatch({ type: `userModel/lock`, payload: { user } });
      },
      onUnlockUser(user) {
        dispatch({ type: `userModel/unlock`, payload: { user } });
      },
      onSendMessage({ props }, fields) {
        const intl = useIntl();
        dispatch({
          type: 'notificationModel/createAndUpdate',
          payload: {
            type: intl.formatMessage({id: 'notifications.message', defaultMessage: 'Message'}),
            title: fields.title,
            description: fields.description,
            status: STATUS.sent,
            isPrivate: fields.isPrivate,
            sentTo: props.to.email
          }
        });
      },
      onSendVerification(user) {
        const intl = useIntl();
        if (user.email) {
          dispatch({ type: `userModel/sendVerification`, payload: { user } });
        } else {
          message.warning(intl.formatMessage({id: 'msg.errorSentEmail', defaultMessage: ''})).then(() => {
            message.warning(i18n.formatMessage({id: 'error.noEmail', defaultMessage: 'Email address is required'})).then();
          });
        }
      }
    })
)(users);
