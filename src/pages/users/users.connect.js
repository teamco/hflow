import { connect, useIntl } from '@umijs/max';
import { message } from 'antd';

import { users } from './users';
import { t } from '@/utils/i18n';

export default connect(
    ({ authModel, userModel, roleModel, pageModel, loading }) => ({
      authModel,
      userModel,
      pageModel,
      roleModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onQuery() {
        dispatch({ type: `userModel/query` });
      },
      onChangeGridLayout() {
        dispatch({ type: `pageModel/changeGridLayout` });
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
          dispatch({ type: `userModel/sendVerification`, payload: { user } });
        } else {
          // message.warning(t(intl, 'msg.errorSentEmail')).then(async () => {
          //   await message.warning(t(intl, 'error.noEmail'));
          // });
          return console.warn(t(intl, 'error.noEmail'));
        }
      }
    })
)(users);
