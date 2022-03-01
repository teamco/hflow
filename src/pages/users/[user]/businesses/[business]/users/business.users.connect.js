import { connect, useIntl} from 'umi';
import { businessUsers } from './business.users';
import { message } from 'antd';

export default connect(
    ({ businessModel, userRoleModel, userModel, loading }) => ({
      businessModel,
      userRoleModel,
      userModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onQuery(params) {
        dispatch({ type: `businessModel/usersQuery`, payload: { ...params } });
        dispatch({ type: `userRoleModel/query` });
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
      onSendVerification(user) {
        const intl = useIntl();
        if (user.email) {
          dispatch({ type: `userModel/sendVerification`, payload: { user } });
        } else {
          message.warning(intl.formatMessage({id: 'msg:errorSentEmail', defaultMessage: 'Error Message Been Send'})).then(() => {
            message.warning(intl.formatMessage({id: 'error.noEmail', defaultMessage: 'Email address is required'})).then();
          });
        }
      },
      onResendRegisterLink(data) {
        dispatch({ type: 'businessModel/sendRegisterLink', payload: { data, isResend: true } });
      }
    })
)(withTranslation()(businessUsers));
