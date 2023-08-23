import { connect } from '@umijs/max';
import { businessUsers } from './business.users';
import { message } from 'antd';
import { t } from '@/utils/i18n';

export default connect(
    ({ businessModel, authModel, roleModel, userModel, loading }) => ({
      businessModel,
      roleModel,
      authModel,
      userModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onQuery(params) {
        dispatch({ type: `businessModel/usersQuery`, payload: { ...params } });
        dispatch({ type: `roleModel/query`, payload: { component: 'business.roles', docName: 'businessRoles' } });
      },
      onUpdateRole(params, user, role) {
        dispatch({ type: `businessModel/updateUserRole`, payload: { params, user, role } });
      },
      onAssignUser(user) {
        dispatch({ type: `businessModel/assignUser`, payload: { user } });
      },
      onUnassignUser(user) {
        dispatch({ type: `businessModel/unassignUser`, payload: { user } });
      },
      onSendVerification(user, intl) {
        if (user.email) {
          dispatch({ type: `userModel/sendVerification`, payload: { user } });
        } else {
          return console.warn(t(intl, 'error.noEmail'));
          // message.warning(t(intl, 'msg.errorSentEmail')).then(async () => {
          //   await message.warning(t(intl, 'error.noEmail'));
          // });
        }
      },
      onResendRegisterLink(data, intl) {
        dispatch({ type: 'businessModel/sendRegisterLink', payload: { data, intl, isResend: true } });
      }
    })
)(businessUsers);
